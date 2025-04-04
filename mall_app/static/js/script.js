async function mod_reporte(id) {
    const url = `/admin/mod_reporte/${id}`;

    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Operación exitosa');
            window.location.href = "/admin/";
            
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo eliminar el reporte. Por favor, inténtalo nuevamente.');
        }
    }
}

async function elim_usuario_admins(idusuarios) {
    const url = `/admin/elim_usuario_admins/${idusuarios}`;

    if (confirm('¿Estás seguro de que deseas eliminar esta tienda?')) {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Operación exitosa');
            window.location.href = "/admin/tiendas";
            
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo eliminar el reporte. Por favor, inténtalo nuevamente.');
        }
    }
}

async function elim_usuario_mi_usuario(idusuarios) {
    const url = `/elim_usuario_mi_usuario/${idusuarios}`;

    if (confirm('¿Estás seguro de que deseas eliminar tu usuario?')) {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Operación exitosa');
            window.location.href = "/";
            
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo eliminar el usuario. Por favor, inténtalo nuevamente.');
        }
    }
}

function edit_email(id) {
    const email = document.getElementById(`edit-email-${id}`).value;
    const contraseña = document.getElementById(`edit-email-contraseña-${id}`).value;
    const url = `/edit_email/${id}`;

    if (email.length > 50) {
        alert('El email es de máximo 50 caracteres')
    }

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'email': email, 'contraseña': contraseña})
    }).then(response => {
        if(response.ok) {
            window.location.href = "/";
        } else {
            alert('Contraseña invalida')
        }
    }).catch(error => {
        console.log(error);
    })
}

function edit_contraseña(id) {
    const contraseñaActual = document.getElementById(`edit-contraseña-actual-${id}`).value;
    const contraseñaNueva = document.getElementById(`edit-contraseña-nueva-${id}`).value;
    const url = `edit_contraseña/${id}`;

    if (contraseñaNueva.length > 12) {
        alert('La contraseña puede ser de máximo 12 caracteres')
        return false
    } else {
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'contraseña-actual': contraseñaActual, 'contraseña-nueva': contraseñaNueva})
        }).then(response => {
            if (response.ok) {
                window.location.href = '/'
            } else {
                alert('Contraseña invalida')
            }
        }).catch(error => {
            console.error(error)
        })
    }
}

function put_fallas(id) {
    const area = document.getElementById(`edit-area`).value;
    const tipo = document.getElementById(`edit-tipo`).value;
    const descripcion = document.getElementById('edit-descripcion').value
    const fecha = document.getElementById(`edit-fecha`).value;
    const estado = document.getElementById('estado').value;
    const idreportes = parseInt(id);
    const url = `/admin/edit_reporte/${idreportes}`;

    if (descripcion.length > 100) {
        alert('La descripcion es muy larga');
        return false;
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'area': area, 'tipo': tipo, 'descripcion': descripcion, 'fecha': fecha, 'estado': estado})
    }).then(response => {
        if(response.ok) {
            window.location.href = "/admin/";
        } else {
            alert('Error al editar la falla')
        }
    }).catch (error => {
        console.error(`Error: ${error}`);
    })
}

function patch_tienda() {
    const id_tienda = document.getElementById('edit-tienda-id').value;
    const tienda = document.getElementById('edit-tienda').value;
    const nombreEncargado = document.getElementById('edit-nombre-tienda').value;
    const apellidoEncargado = document.getElementById('edit-apellido-tienda').value;
    const idusuario = document.getElementById('edit-tienda-user-id').value;

    if (id_tienda === null) {
        alert('Error al editar tienda');
    }

    const url = `/admin/edit_tiendas/${id_tienda}`;

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'idusuario': idusuario, 'Nombre': nombreEncargado, 'Apellido': apellidoEncargado, 'Nombre_tienda': tienda})
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        window.location.href = "/admin/tiendas";
    }).catch(error => {
        console.log(`Error: ${error}`)
    })

}

function change_estado(id) {
    const estado = 'resuelta';
    const url = `/tienda/toggle_estado/${id}`;

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'estado': estado})
    }).then(response => {
        if (response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        window.location.reload();
    }).catch(error =>{
        console.log(error);
    })
}

// FRONT END

document.addEventListener("DOMContentLoaded", () => {
    const toggleMenu = document.getElementById("toggle-menu");

    toggleMenu.addEventListener("click", () => {
        const dropMenu = document.getElementById('drop-down');
        console.log(dropMenu);
        dropMenu.classList.toggle("active");

        if (dropMenu.classList.contains("active")) {
            dropMenu.style.display = 'block';
        } else {
            dropMenu.style.display = 'none';
        }

    });
})

function edit_reporte(id) {
    const area = document.getElementById(`area-${id}`).textContent;
    const tipo = document.getElementById(`tipo-${id}`).textContent;
    const descripcion = document.getElementById(`descripcion-${id}`).textContent;
    const fecha = document.getElementById(`fecha-${id}`).textContent;
    const estado = document.getElementById(`estado-${id}`).textContent;
    console.log(estado);
    document.getElementById('edit-descripcion').innerText = descripcion;
    document.getElementById('edit-fecha').value = fecha;
    document.getElementById('edit-id').value = id;

                    // Seleccionar la opción correcta en el campo de área
    const areaSelect = document.getElementById('edit-area');
            for (let option of areaSelect.options) {
                if (area.toLowerCase().includes(option.text.toLowerCase())) {
                    option.selected = true;
        }
    }

    areaSelect.dispatchEvent(new Event('change'));
    
    // Seleccionar la opción correcta en el campo de tipo
    const tipoSelect = document.getElementById('edit-tipo');
            for (let option of tipoSelect.options) {
                if (tipo.toLowerCase().includes(option.text.toLowerCase())) {
                    option.selected = true;
        }
    }
    
    // Seleccionar la opción correcta en el campo de estado
    const selectEstados = document.getElementById('estado'); // Cambiado a edit-estado
    for (let option of selectEstados.options) {
        if (option.value === estado) { // Comparación exacta
            option.selected = true;
            break; // Salir del bucle una vez encontrado
        }
    }
}

function selecOptionsControlEditModal() {
    // Obtener el select de 'Area' y sus opciones de tipo para el modal de editar falla
    let areaSelectEdit = document.querySelector('#edit-falla__modal select[name="area"]');

    if (areaSelectEdit === null) {
        return null;
    }
        
    // Obtener los select de tipo para cada área en el modal de editar falla
    let tipoElectricoEdit = document.querySelector('#edit-falla__modal .tipo-electrico');
    let tipoElectrico2Edit = document.querySelector('#edit-falla__modal .tipo-electrico2');
    let tipoElectrico3Edit = document.querySelector('#edit-falla__modal .tipo-electrico3');
    let tipoElectrico4Edit = document.querySelector('#edit-falla__modal .tipo-electrico4');
    let tipoPlomeriaEdit = document.querySelector('#edit-falla__modal .tipo-plomeria');
    let tipoPlomeria2Edit = document.querySelector('#edit-falla__modal .tipo-plomeria2');
    let tipoPlomeria3Edit = document.querySelector('#edit-falla__modal .tipo-plomeria3');
    let tipoPlomeria4Edit = document.querySelector('#edit-falla__modal .tipo-plomeria4');
    let tipoPlomeria5Edit = document.querySelector('#edit-falla__modal .tipo-plomeria5');
    let tipoACEdit = document.querySelector('#edit-falla__modal .tipo-AC');
    let tipoAC2Edit = document.querySelector('#edit-falla__modal .tipo-AC2');
    let tipoTelecomsEdit = document.querySelector('#edit-falla__modal .tipo-telecoms');
    let tipoTelecoms2Edit = document.querySelector('#edit-falla__modal .tipo-telecoms2');
    let tipoSelectEdit = document.getElementById('edit-tipo');
    
    // Mostrar u ocultar el select de tipo según la opción seleccionada en 'Area' en el modal de editar falla
    areaSelectEdit.addEventListener('change', function() {
        // Ocultar todos los selects de tipo
        tipoSelectEdit.selectedIndex = 0;

        tipoElectricoEdit.style.display = 'none';
        tipoElectrico2Edit.style.display = 'none';
        tipoElectrico3Edit.style.display = 'none';
        tipoElectrico4Edit.style.display = 'none';

        tipoPlomeriaEdit.style.display = 'none';
        tipoPlomeria2Edit.style.display = 'none';
        tipoPlomeria3Edit.style.display = 'none';
        tipoPlomeria4Edit.style.display = 'none';
        tipoPlomeria5Edit.style.display = 'none';

        tipoACEdit.style.display = 'none';
        tipoAC2Edit.style.display = 'none';

        tipoTelecomsEdit.style.display = 'none';
        tipoTelecoms2Edit.style.display = 'none';
    
        // Mostrar el select de tipo correspondiente a la opción seleccionada
        let selectedArea = areaSelectEdit.value;
        if (selectedArea === 'Electrica') {
            tipoElectricoEdit.style.display = 'block';
            tipoElectrico2Edit.style.display = 'block';
            tipoElectrico3Edit.style.display = 'block';
            tipoElectrico4Edit.style.display = 'block';
        } else if (selectedArea === 'Plomeria') {
            tipoPlomeriaEdit.style.display = 'block';
            tipoPlomeria2Edit.style.display = 'block';
            tipoPlomeria3Edit.style.display = 'block';
            tipoPlomeria4Edit.style.display = 'block';
            tipoPlomeria5Edit.style.display = 'block';
        } else if (selectedArea === 'Aire acondicionado') {
            tipoACEdit.style.display = 'block';
            tipoAC2Edit.style.display = 'block';
        } else if (selectedArea === 'Telecomunicaciones') {
            tipoTelecomsEdit.style.display = 'block';
            tipoTelecoms2Edit.style.display = 'block';
        }
    });
}

selecOptionsControlEditModal();

function selectOptionsControlFallaModal() {
    let areaSelect = document.querySelector('select[name="area"]');

    if (areaSelect === null) {
        return null;
    }
        
        // Obtener los select de tipo para cada área
        let tipoElectrico = document.querySelector('.tipo-electrico');
        let tipoElectrico2 = document.querySelector('.tipo-electrico2');
        let tipoElectrico3 = document.querySelector('.tipo-electrico3');
        let tipoElectrico4 = document.querySelector('.tipo-electrico4');
    
        let tipoPlomeria = document.querySelector('.tipo-plomeria');
        let tipoPlomeria2 = document.querySelector('.tipo-plomeria2');
        let tipoPlomeria3 = document.querySelector('.tipo-plomeria3');
        let tipoPlomeria4 = document.querySelector('.tipo-plomeria4');
        let tipoPlomeria5 = document.querySelector('.tipo-plomeria5');
    
        let tipoAC = document.querySelector('.tipo-AC');
        let tipoAC2 = document.querySelector('.tipo-AC2');
        
        let tipoTelecoms = document.querySelector('.tipo-telecoms');
        let tipoTelecoms2 = document.querySelector('.tipo-telecoms2');

        let tipoSelect = document.getElementById('tipo__falla-modal');
        
        // Mostrar u ocultar el select de tipo según la opción seleccionada en 'Area'
        areaSelect.addEventListener('change', function() {
            // Ocultar todos los selects de tipo
            tipoSelect.selectedIndex = 0;

            tipoElectrico.style.display = 'none';
            tipoElectrico2.style.display = 'none';
            tipoElectrico3.style.display = 'none';
            tipoElectrico4.style.display = 'none';
    
            tipoPlomeria.style.display = 'none';
            tipoPlomeria2.style.display = 'none';
            tipoPlomeria3.style.display = 'none';
            tipoPlomeria4.style.display = 'none';
            tipoPlomeria5.style.display = 'none';
    
            tipoAC.style.display = 'none';
            tipoAC2.style.display = 'none';
    
            tipoTelecoms.style.display = 'none';
            tipoTelecoms2.style.display = 'none';
        
            // Mostrar el select de tipo correspondiente a la opción seleccionada
            let selectedArea = areaSelect.value;
            if (selectedArea === 'Electrica') {
                tipoElectrico.style.display = 'block';
                tipoElectrico2.style.display = 'block';
                tipoElectrico3.style.display = 'block';
                tipoElectrico4.style.display = 'block';
            } else if (selectedArea === 'Plomeria') {
                tipoPlomeria.style.display = 'block';
                tipoPlomeria2.style.display = 'block';
                tipoPlomeria3.style.display = 'block';
                tipoPlomeria4.style.display = 'block';
                tipoPlomeria5.style.display = 'block';
            } else if (selectedArea === 'Aire acondicionado') {
                tipoAC.style.display = 'block';
                tipoAC2.style.display = 'block';
            } else if (selectedArea === 'Telecomunicaciones') {
                tipoTelecoms.style.display = 'block';
                tipoTelecoms2.style.display = 'block';
            }
        });
}

selectOptionsControlFallaModal();


function editTienda(id) {

    const tienda = document.getElementById(`tienda-${id}`).textContent;
    const nombre = document.getElementById(`nombre-${id}`).textContent;
    const apellido = document.getElementById(`apellido-${id}`).textContent;
    const id_tienda = document.getElementById(`id-tienda-${id}`).textContent;
    const id_Usuariotienda = document.getElementById(`id-user-tienda-${id}`).value;

    document.getElementById('edit-tienda').value = tienda;
    document.getElementById('edit-nombre-tienda').value = nombre;
    document.getElementById('edit-apellido-tienda').value = apellido;
    document.getElementById('edit-tienda-id').value = id_tienda;
    document.getElementById('edit-tienda-user-id').value = id_Usuariotienda;

}

