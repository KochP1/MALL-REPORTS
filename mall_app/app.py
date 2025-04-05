from flask import Flask
from flask_login import LoginManager
import pymysql
from os import getenv
from dotenv import load_dotenv


def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/')

    app.config['SECRET_KEY'] = getenv('SECRET_KEY')
    app.config['DB_HOST'] = getenv('DB_HOST')
    app.config['DB_USER'] = getenv('DB_USER')
    app.config['DB_PASSWORD'] = getenv('DB_PASSWORD')
    app.config['DB_NAME'] = getenv('DB_NAME')

    # Configuración para uploads
    app.config['UPLOAD_FOLDER'] = 'static/uploads'
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    app.secret_key = app.config['SECRET_KEY']

    db = pymysql.connect(
    host=app.config['DB_HOST'],
    port=3306,
    user=app.config['DB_USER'],
    password=app.config['DB_PASSWORD'],
    database=app.config['DB_NAME']
)

    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            if result:
                print("Conexion")
            else:
                print("error")
    except pymysql.Error as e:
        print(f"Error al conectar a la base de datos: {e}")
    
    app.app_context().push()

    
    login_manager = LoginManager()
    login_manager.init_app(app)

    from mall_app.blueprints.users.model import User

    @login_manager.user_loader
    def load_users(user_id):
        return User.get_by_id(db, user_id)
    

    # import and register all blueprints
    from mall_app.blueprints.admin.routes import admin
    from mall_app.blueprints.users.routes import users
    from mall_app.blueprints.tiendas.routes import tienda

    app.register_blueprint(users, url_prefix='/')
    app.register_blueprint(admin, url_prefix='/admin')
    app.register_blueprint(tienda, url_prefix='/tienda')

    # Pasar la conexión a la base de datos al Blueprint
    app.config['db'] = db
    return app