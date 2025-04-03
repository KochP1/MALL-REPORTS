from flask import request, render_template, redirect, url_for, Blueprint, current_app, jsonify
from flask_login import login_user, logout_user, current_user
from flask_bcrypt import Bcrypt, generate_password_hash

tienda = Blueprint('tienda', __name__, template_folder='templates', static_folder="static")
bcrypt = Bcrypt()

@tienda.route('/', methods = ['GET', 'POST'])
def index():
    return render_template('tiendas/index.html')
