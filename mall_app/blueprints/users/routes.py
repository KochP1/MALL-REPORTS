from flask import request, render_template, redirect, url_for, Blueprint, current_app
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

@users.route('ajustes')
def ajustes():
    if request.method == 'GET':
        return render_template('users/ajustes.html')

@users.route('/log_out')
def log_out():
    logout_user()
    return redirect(url_for('users.index'))