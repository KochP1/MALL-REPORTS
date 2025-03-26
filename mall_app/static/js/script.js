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

async function mod_tiendas(idusuarios) {
    const url = `/admin/mod_tiendas/${idusuarios}`;

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

function put_fallas(id) {
    const area = document.getElementById(`edit-area`).value;
    const tipo = document.getElementById(`edit-tipo`).value;
    const descripcion = document.getElementById('edit-descripcion').value
    const fecha = document.getElementById(`edit-fecha`).value;
    const estado = document.getElementById('estado').value;
    const idreportes = parseInt(id);
    const url = `/admin/edit_reporte/${idreportes}`;

    if (descripcion.length) {
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
        console.error(`Error: ${error}`)
    })
}

// FRONT END

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
    
    // Seleccionar la opción correcta en el campo de tipo
    const tipoSelect = document.getElementById('edit-tipo');
            for (let option of tipoSelect.options) {
                if (tipo.toLowerCase().includes(option.text.toLowerCase())) {
                    option.selected = true;
        }
    }
    
    // Seleccionar la opción correcta en el campo de estado
    const selectEstados = document.getElementById('estado');
            for (let option of selectEstados.options) {
                if (estado.toLowerCase().includes(option.text.toLowerCase())) {
                    option.selected = true;
        }
    }
}

function selecOptionsControlEditModal() {
    // Obtener el select de 'Area' y sus opciones de tipo para el modal de editar falla
    let areaSelectEdit = document.querySelector('#edit-falla__modal select[name="area"]');
        
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

