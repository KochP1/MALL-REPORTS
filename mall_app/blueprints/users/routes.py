from flask import request, render_template, redirect, url_for, Blueprint, current_app, jsonify
from flask_login import login_user, logout_user, current_user
from flask_bcrypt import Bcrypt, generate_password_hash

from .model import User

users = Blueprint('users', __name__, template_folder='templates', static_folder="static")
bcrypt = Bcrypt()

@users.route('/', methods = ['GET', 'POST'])
def index():
    db = current_app.config['db']
    if request.method == 'GET':
        return render_template('users/index.html')
    
    if request.method == 'POST':
        email = request.form['email']
        contraseña = request.form['password']
        try:
            user = User.get_by_email(db, email)
            if user and bcrypt.check_password_hash(user.contraseña, contraseña):
                login_user(user)
                print("hash successfull")

                if user.rol == 'administrador':
                    return redirect(url_for('admin.index'))
                if user.rol == 'tienda':
                    return redirect(url_for('tienda.index'))
            else:
                return render_template('users/index.html', message = 'Creadenciales invalidas')
            
        except Exception as e:
            print(e)

@users.route('/regist_admin', methods = ['GET', 'POST'])
def regist_admin():
    db = current_app.config['db']
    if request.method == 'GET':
        return render_template('users/regist.html')
    
    if request.method == 'POST':
        nombre = request.form['name']
        apellido = request.form['lastname']
        email = request.form['email']
        contraseña = request.form['password']
        rol = "administrador"
        hash_contraseña = bcrypt.generate_password_hash(contraseña).decode('utf-8')

        if len(nombre) > 20:
            return redirect(url_for('admin.index'))
        elif len(apellido) > 20:
            return redirect(url_for('admin.index'))
        elif len(email) > 50:
            return redirect(url_for('admin.index'))
        elif len(contraseña) > 12:
            return redirect(url_for('admin.index'))

        try:
            cur = db.cursor()
            sql = 'INSERT INTO usuarios (`nombre`, `apellido`, `email`, `contraseña`, `rol`) VALUES (%s, %s, %s, %s, %s)'
            data = (nombre, apellido, email, hash_contraseña, rol)
            cur.execute(sql, data)
            db.commit()
            return redirect(url_for('users.index'))
        except Exception as e:
            print(e)
            return redirect(url_for('users.regist_admin'))
        finally:
            cur.close()

@users.route('/ajustes')
def ajustes():
    if request.method == 'GET':
        return render_template('users/ajustes.html')

@users.route('elim_usuario_mi_usuario/<int:idusuario>', methods = ['DELETE'])
def elim_usuario_mi_usuario(idusuario):
    db = current_app.config['db']
    if request.method == 'DELETE':
        if idusuario:
            try:
                cur = db.cursor()
                cur.execute('DELETE FROM usuarios WHERE idusuarios = %s', (idusuario,))
                db.commit()

                return jsonify({"message": "Usuario eliminado correctamente."}), 200
            except Exception as e:
                print(e)
                return jsonify({"error": "El usuario no se puedo eliminar."}), 404
            finally:
                cur.close()

@users.route('edit_email/<int:id>', methods = ['PATCH'])
def edit_email(id):
    db = current_app.config['db']
    if request.method == 'PATCH':
        if not id and not request.is_json:
            return jsonify({'error': 'El cuerpo debe ser JSON'}), 400
        
        data = request.get_json()

        required_fields = ['email', 'contraseña']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        try:
            cur = db.cursor()
            sql_contraseña = 'SELECT contraseña FROM usuarios WHERE idusuarios = %s'
            cur.execute(sql_contraseña, id)
            contraseña = cur.fetchone()
            contraseña_hash = " ".join(str(elemento) for elemento in contraseña)

            if bcrypt.check_password_hash(contraseña_hash, data['contraseña']):
                sql_email = 'UPDATE usuarios SET email = %s WHERE idusuarios = %s'
                data_edit_email = (data['email'], id)
                cur.execute(sql_email, data_edit_email)
                db.commit()

                return jsonify({
                    "success": True,
                    "message": "Email editado",
                    "updated_id": id
                    }), 200
        except Exception as e:
            print(e)
            return jsonify({
                    "success": False,
                    "message": "Error al editar email",
                    "updated_id": id
                    }), 400
        finally:
            cur.close()
        

@users.route('edit_contraseña/<int:id>', methods = ['PATCH'])
def edit_contraseña(id):
    db = current_app.config['db']
    if request.method == 'PATCH':
        if not id and not request.is_json:
            return jsonify({'error': 'El cuerpo debe ser JSON'}), 400
        
        data = request.get_json()

        required_fields = ['contraseña-actual', 'contraseña-nueva']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        try:
            cur = db.cursor()
            sql_contraseña = 'SELECT contraseña FROM usuarios WHERE idusuarios = %s'
            cur.execute(sql_contraseña, id)
            contraseña = cur.fetchone()
            contraseña_hash = " ".join(str(elemento) for elemento in contraseña)

            if bcrypt.check_password_hash(contraseña_hash, data['contraseña-actual']):
                hash_contraseña = bcrypt.generate_password_hash(data['contraseña-nueva']).decode('utf-8')
                sql_contraseña = 'UPDATE usuarios SET contraseña = %s WHERE idusuarios = %s'
                data_edit_contraseña = (hash_contraseña, id)
                cur.execute(sql_contraseña, data_edit_contraseña)
                db.commit()

                return jsonify({
                    "success": True,
                    "message": "Contraseña editada",
                    "updated_id": id
                    }), 200
        except Exception as e:
            print(e)
            return jsonify({
                    "success": False,
                    "message": "Error al editar contraseña",
                    "updated_id": id
                    }), 400
        finally:
            cur.close()

@users.route('/log_out')
def log_out():
    logout_user()
    return redirect(url_for('users.index'))