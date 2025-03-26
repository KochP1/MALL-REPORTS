document.addEventListener('DOMContentLoaded', function() {
    const btnExportar = document.getElementById('btn-excel'), 
        reportes = document.getElementById('tablaReportes');
    
        let tableExport = new TableExport(reportes, {
            exportButtons: false,
            filename: "ReportesMarzo",
            sheetname: "Tabla"
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

    })
})