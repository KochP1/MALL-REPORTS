from flask import request, render_template, redirect, url_for, Blueprint
from flask_login import login_user, logout_user, current_user
from flask_bcrypt import Bcrypt, generate_password_hash

admin = Blueprint('admin', __name__, template_folder='templates', static_folder="static")
bcrypt = Bcrypt()

@admin.route('/')
def index():
    return render_template('admin/index.html')
