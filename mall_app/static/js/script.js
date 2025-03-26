function mod_reporte(id) {
    const url = `/admin/mod_reporte/${id}`;

    if (confirm('Are you sure you want to delete this list?')) {
        fetch(url, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok){
                console.log('Operacion exitosa');
                window.location.href = "/admin/";
            }

            else {
                console.log('Error al eliminar reporte')
            }
        }).catch(error => {
            console.error(`Error: ${error}`)
        })
    }
}

function mod_tiendas(idusuarios) {
    const url = `/admin/mod_tiendas/${idusuarios}`;

    if (confirm('Are you sure you want to delete this list?')) {
        fetch(url, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok){
                console.log('Operacion exitosa');
                window.location.href = "/admin/tiendas";
            }

            else {
                console.log('Error al eliminar tienda')
            }
        }).catch(error => {
            console.error(`Error: ${error}`)
        })
    }
}