from flask import request, render_template, redirect, url_for, Blueprint, current_app, jsonify
from flask_login import login_user, logout_user, current_user
from flask_bcrypt import Bcrypt, generate_password_hash

tienda = Blueprint('tienda', __name__, template_folder='templates', static_folder="static")
bcrypt = Bcrypt()

@tienda.route('/', methods = ['GET', 'POST'])
def index():
    db = current_app.config['db']
    if request.method == 'GET':
        cur = db.cursor()
        idusuario = (current_user.id,)

        sql_tienda = 'SELECT * from tiendas t WHERE t.usuarios = %s'
        cur.execute(sql_tienda, idusuario)
        tienda = cur.fetchall()
        insertTienda = []
        columTiendaNamens = [column[0] for column in cur.description]
        for record in tienda:
            insertTienda.append(dict(zip(columTiendaNamens, record)))
        print(insertTienda)

        sql_falla = 'SELECT r.idreportes, r.area, r.tipo, r.descripcion, r.fecha, r.estado, t.idtiendas, t.nombre_tienda FROM reportes r JOIN tiendas t ON t.idtiendas = r.tienda WHERE t.usuarios = %s'
        cur.execute(sql_falla, idusuario)
        reportes = cur.fetchall()
        insertReporte= []
        columNamens = [column[0] for column in cur.description]
        for record in reportes:
            insertReporte.append(dict(zip(columNamens, record)))
        cur.close()
        return render_template('tiendas/index.html', fallas = insertReporte, tienda = insertTienda)
    
    if request.method == 'POST':
        tienda = request.form['tienda']
        area = request.form['area']
        tipo = request.form['tipo']
        descripcion = request.form['descripcion']
        fecha = request.form['fecha']
        estado = 'no resuelta'

        if len(descripcion) > 100:
            return redirect(url_for('admin.index'))

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
            return redirect(url_for('tienda.index'))

@tienda.route('/toggle_estado/<int:id>', methods = ['PATCH'])
def toggle_estado(id):
    db = current_app.config['db']
    if request.method == 'PATCH':
        if not id and not request.is_json:
            return jsonify({'error': 'El cuerpo debe ser JSON'}), 400
        
        data = request.get_json()

        required_fields = ['estado']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        try:
            cur = db.cursor()
            sql = 'UPDATE reportes r JOIN tiendas t ON r.tienda = t.idtiendas SET r.estado = %s WHERE r.idreportes = %s'
            sql_data = (data['estado'], id)
            cur.execute(sql, sql_data)
            db.commit()
            # Retornar éxito
            return jsonify({
            "success": True,
            "message": "Estado actualizado correctamente",
            "updated_id": id
            }), 200
        except Exception as e:
            print(f'Error: {e}')
        finally:
            cur.close()
            return redirect(url_for('tienda.index'))