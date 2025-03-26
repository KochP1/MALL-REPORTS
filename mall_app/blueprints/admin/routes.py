from flask import request, render_template, redirect, url_for, Blueprint, current_app, jsonify
from flask_login import login_user, logout_user, current_user
from flask_bcrypt import Bcrypt, generate_password_hash

admin = Blueprint('admin', __name__, template_folder='templates', static_folder="static")
bcrypt = Bcrypt()

@admin.route('/', methods = ['GET', 'POST'])
def index():
    db = current_app.config['db']
    if request.method == 'GET':
        cur = db.cursor()
        cur.execute('SELECT idtiendas, nombre_tienda FROM tiendas')
        data = cur.fetchall()
        insertTienda = []
        columNamnes = [column[0] for column in cur.description]
        for record in data:
            insertTienda.append(dict(zip(columNamnes, record)))
        print(f'Tiendas: {insertTienda}')

        cur.execute('SELECT r.idreportes, t.nombre_tienda, r.area, r.tipo, r.descripcion, r.fecha, r.estado FROM reportes r JOIN tiendas t ON r.tienda = t.idtiendas')
        data_reportes = cur.fetchall()
        insertReportes = []
        columNamnesReportes = [column[0] for column in cur.description]
        for record in data_reportes:
            insertReportes.append(dict(zip(columNamnesReportes, record)))
        print(f'Reportes: {insertReportes}')

        cur.close()
        return render_template('admin/index.html', tiendas = insertTienda, reportes = insertReportes)
    
    if request.method == 'POST':
        tienda = request.form['tienda']
        area = request.form['area']
        tipo = request.form['tipo']
        descripcion = request.form['descripcion']
        fecha = request.form['fecha']
        estado = 'no resuelta'
        print(tienda)

        try:
            cur = db.cursor()
            sql = 'INSERT INTO reportes (`tienda`, `area`, `tipo`, `descripcion`, `fecha`, `estado`) VALUES (%s, %s, %s, %s, %s, %s)'
            values = (tienda, area, tipo, descripcion, fecha, estado)
            cur.execute(sql, values)
            db.commit()
        except Exception as e:
            print(e)
        finally:
            cur.close()
            return redirect(url_for('admin.index'))

@admin.route('mod_reporte/<int:idreportes>', methods = ['DELETE', 'PUT'])
def mod_reporte(idreportes):
    db = current_app.config['db']
    if request.method == 'DELETE':
        if idreportes:
            try:
                cur = db.cursor()
                cur.execute('DELETE FROM reportes WHERE idreportes = %s', (idreportes,))
                db.commit()
                return jsonify({"message": "Reporte eliminado correctamente."}), 200
            except Exception as e:
                print(f'Error: {e}')
                return jsonify({"error": "El reporte no existe."}), 404
            finally:
                cur.close()


@admin.route('/tiendas', methods = ['GET', 'POST'])
def tiendas():
    db = current_app.config['db']

    if request.method == 'GET':
        cur = db.cursor()

        cur.execute('SELECT t.idtiendas, t.nombre_tienda, u.nombre, u.apellido FROM tiendas t JOIN usuarios u ON t.usuarios = u.idusuarios')
        data = cur.fetchall()
        cur.close()
        insertTienda = []
        columNamnes = [column[0] for column in cur.description]
        for record in data:
            insertTienda.append(dict(zip(columNamnes, record)))
        
        print(insertTienda)
        return render_template('admin/tiendas.html', tiendas = insertTienda)
    
    if request.method == 'POST':

        nombreTienda = request.form['tienda']
        nombreEncargado = request.form['nombre']
        apellidoEncargado = request.form['apellido']
        email = request.form['email']
        contraseña = request.form['contraseña']
        rol = 'tienda'
        hash_contraseña = bcrypt.generate_password_hash(contraseña).decode('utf-8')

        try:
            cur = db.cursor()

            sql = 'INSERT INTO usuarios (`nombre`, `apellido`, `email`, `contraseña`, `rol`) VALUES (%s, %s, %s, %s, %s)'
            data = (nombreEncargado, apellidoEncargado, email, hash_contraseña, rol)
            cur.execute(sql, data)
            db.commit()

            cur.execute('SELECT idusuarios FROM usuarios WHERE email =  %s', (email,))
            idusuario = cur.fetchone()

            sql_tienda = 'INSERT INTO tiendas (`usuarios`, `nombre_tienda`) VALUES (%s, %s)'
            data_tienda = (idusuario, nombreTienda)
            cur.execute(sql_tienda, data_tienda)
            db.commit()

        except Exception as e:
            print(e)
        finally:
            cur.close()
        return redirect(url_for('admin.tiendas'))
