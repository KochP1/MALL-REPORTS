from flask import render_template, request, redirect, url_for
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, nombre, apellido, contraseña, email, rol):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.email = email
        self.contraseña = contraseña
        self.rol = rol

    @staticmethod
    def get_by_id(db, user_id):
        """Obtener un usuario por su ID."""
        cur = db.cursor()
        cur.execute('SELECT * FROM usuarios WHERE idusuarios = %s', (user_id,))
        user_data = cur.fetchone()
        cur.close()
        if user_data:
            return User(
                id=user_data[0],
                nombre=user_data[1],
                apellido=user_data[2],
                email=user_data[3],
                contraseña = user_data[4],
                rol = user_data[5]
            )
        return None
    
    @staticmethod
    def get_by_email(db, email):
        """Obtener un usuario por su nombre de usuario."""
        cur = db.cursor()
        cur.execute('SELECT * FROM usuarios WHERE email = %s', (email))
        user_data = cur.fetchone()
        cur.close()
        if user_data:
            return User(
                id=user_data[0],
                nombre=user_data[1],
                apellido=user_data[2],
                email=user_data[3],
                contraseña = user_data[4],
                rol = user_data[5],
            )
        return None