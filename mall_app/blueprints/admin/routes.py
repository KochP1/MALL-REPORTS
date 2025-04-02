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
        print(type(fecha))

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
            return redirect(url_for('admin.index'))

@admin.route('/filtrar_reportes', methods = ['POST'])
def filtrar_reportes():
    db = current_app.config['db']
    fecha_inicio = request.form['fecha_inicio']
    fecha_fin = request.form['fecha_fin' ]

    if not fecha_inicio or not fecha_fin:
        return "Fechas no proporcionadas", 400
    
    try:
        cur = db.cursor()
        sql = 'SELECT * FROM reportes WHERE fecha BETWEEN %s AND %s ORDER BY fecha DESC'
        cur.execute(sql, (fecha_inicio, fecha_fin))
        reportes = cur.fetchall()
        insertReportes = []
        columNamnesReportes = [column[0] for column in cur.description]
        for record in reportes:
            insertReportes.append(dict(zip(columNamnesReportes, record)))
        return render_template('admin/index.html', reportes = insertReportes)
    except Exception as e:
        return f"Error en la base de datos: {str(e)}", 500
    finally:
        cur.close()

@admin.route('/mod_reporte/<int:idreportes>', methods = ['DELETE'])
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
    
    if request.method == 'PUT':
        if idreportes:
            data = request.get_json()
            print(data)
            return redirect(url_for('admin.index'))

@admin.route('/edit_reporte/<int:idreportes>', methods = ['PUT'])
def edit_reorte(idreportes):
    db = current_app.config['db']
    
    # Validar que existan datos JSON
    if not request.is_json:
        return jsonify({"error": "El cuerpo debe ser JSON"}), 400
    
    data = request.get_json()
    
    # Validar campos obligatorios
    required_fields = ['area', 'tipo', 'descripcion', 'fecha', 'estado']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    try:
        cur = db.cursor()
        sql = """
            UPDATE reportes 
            SET area = %s, tipo = %s, descripcion = %s, fecha = %s, estado = %s
            WHERE idreportes = %s
        """
        cur.execute(sql, (
            data['area'],
            data['tipo'],
            data['descripcion'],
            data['fecha'],
            data['estado'],
            idreportes
        ))
        db.commit()
        
        # Retornar éxito
        return jsonify({
            "success": True,
            "message": "Reporte actualizado correctamente",
            "updated_id": idreportes
        }), 200
        
    except Exception as e:
        db.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "details": str(e)
        }), 500
    finally:
        cur.close()


@admin.route('/tiendas', methods = ['GET', 'POST'])
def tiendas():
    db = current_app.config['db']

    if request.method == 'GET':
        cur = db.cursor()

        cur.execute('SELECT t.idtiendas, t.nombre_tienda, u.idusuarios, u.nombre, u.apellido FROM tiendas t JOIN usuarios u ON t.usuarios = u.idusuarios')
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

        if len(nombreTienda) > 30:
            return redirect(url_for('admin.index'))
        elif len(nombreEncargado) > 20:
            return redirect(url_for('admin.index'))
        elif len(apellidoEncargado) > 20:
            return redirect(url_for('admin.index'))
        elif len(email) > 50:
            return redirect(url_for('admin.index'))
        elif len(contraseña) > 12:
            return redirect(url_for('admin.index'))

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

@admin.route('mod_tiendas/<int:idusuario>', methods = ['DELETE'])
def mod_tiendas(idusuario):
    db = current_app.config['db']
    if request.method == 'DELETE':
        if idusuario:
            try:
                cur = db.cursor()
                cur.execute('DELETE FROM usuarios WHERE idusuarios = %s', (idusuario,))
                db.commit()

                return jsonify({"message": "Tienda eliminada correctamente."}), 200
            except Exception as e:
                print(e)
                return jsonify({"error": "la tienda no se puedo eliminar."}), 404
            finally:
                cur.close()

@admin.route('/edit_tiendas/<int:idtiendas>', methods = ['PATCH'])
def edit_tiendas(idtiendas):
    db = current_app.config['db']
    if request.method == 'PATCH':
        if not idtiendas and not request.is_json:
            return jsonify({'error': 'El cuerpo debe ser JSON'}), 400
        
        data = request.get_json()

        required_fields = ['idusuario', 'Nombre', 'Apellido', 'Nombre_tienda']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        try:
            cur = db.cursor()
            sql = 'UPDATE tiendas t JOIN usuarios u ON usuarios = idusuarios SET u.nombre = %s, u.apellido = %s, t.nombre_tienda = %s WHERE usuarios = %s'
            sql_data = (data['Nombre'], data['Apellido'], data['Nombre_tienda'], data['idusuario'])
            cur.execute(sql, sql_data)
            db.commit()

            # Retornar éxito
            return jsonify({
            "success": True,
            "message": "Reporte actualizado correctamente",
            "updated_id": idtiendas
            }), 200
        except Exception as e:
            print(e)
            return jsonify({
                "success": False,
                "message": "Error al actualizar los datos",
                "error": str(e)
            }), 500
        finally:
            cur.close()