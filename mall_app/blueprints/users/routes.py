from flask import request, render_template, redirect, url_for, Blueprint, current_app
from flask_login import login_user, logout_user, current_user
from flask_bcrypt import Bcrypt, generate_password_hash

users = Blueprint('users', __name__, template_folder='templates', static_folder="static")
bcrypt = Bcrypt()

@users.route('/', methods = ['GET', 'POST'])
def index():
    db = current_app.config['db']
    if request.method == 'GET':
        return render_template('users/index.html')

@users.route('regist_admin', methods = ['GET', 'POST'])
def regist_admin():
    db = current_app.config['db']
    if request.method == 'GET':
        return render_template('users/regist.html')
