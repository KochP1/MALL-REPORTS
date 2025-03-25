from flask import request, render_template, redirect, url_for, Blueprint, current_app
from flask_login import login_user, logout_user, current_user
from flask_bcrypt import Bcrypt, generate_password_hash

admin = Blueprint('admin', __name__, template_folder='templates', static_folder="static")
bcrypt = Bcrypt()

@admin.route('/')
def index():
    return render_template('admin/index.html')

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
