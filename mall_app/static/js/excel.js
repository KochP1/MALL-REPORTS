/*document.addEventListener('DOMContentLoaded', function() {
    const btnExportar = document.getElementById('btn-excel'), 
        reportes = document.getElementById('tablaReportes');
    
        let tableExport = new TableExport(reportes, {
            exportButtons: false,
            filename: "ReportesMarzo",
            sheetname: "Tabla",
            ignoreColumns: [7, 8],
            exportStyles: true // Asegura que se respeten los estilos CSS
        });
    btnExportar.addEventListener('click', () => {
        let datos = tableExport.getExportData();
        let pref = datos.tablaReportes.xlsx;
        tableExport.export2file(
            pref.data,
            pref.mimetype,
            pref.filename,
            pref.fileExtension,
            pref.merges,
            pref.RTL,
            pref.sheetname
        );

        window.location.href = '/admin/';
    })
})*/

function excel() {
    const reportes = document.getElementById('tablaReportes');
    let tableExport = new TableExport(reportes, {
        exportButtons: false,
        //filename: "ReportesMarzo",
        sheetname: "Tabla",
    });

    let datos = tableExport.getExportData();
    let pref = datos.tablaReportes.xlsx;
    tableExport.export2file(
            pref.data,
            pref.mimetype,
            pref.filename,
            pref.fileExtension,
            pref.merges,
            pref.RTL,
            pref.sheetname
        );
    window.location.reload();
}

function migrarExcel() {

    const btnsTabla = document.querySelectorAll('.td-btn')

    for (let i = 0; i < btnsTabla.length; i++) {
        btnsTabla[i].remove();
    }

    excel()
}

