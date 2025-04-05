document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Check localStorage and apply dark mode if enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            enableDarkMode();
            localStorage.setItem('darkMode', 'enabled');
        } else {
            disableDarkMode();
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('.styleIcon');
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

        const table = document.querySelectorAll(".table");
        table.forEach(table => table.classList.add("table-dark"));
        table.forEach(table => table.classList.add("table-bordered"));

        const opsNav = document.querySelectorAll(".opciones-reportes__container");
        opsNav.forEach(ops => ops.classList.add("dark-mode"));

        const opsAjustes = document.querySelectorAll(".ajustes-opt");
        opsAjustes.forEach(ops => ops.classList.add("dark-mode"));

        const tiendaCard = document.querySelectorAll(".tienda-card");
        tiendaCard.forEach(card => card.classList.add("dark-mode"));


    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

        const table = document.querySelectorAll(".table");
        table.forEach(table => table.classList.remove("table-dark"));
        table.forEach(table => table.classList.remove("table-bordered"));

        const opsNav = document.querySelectorAll(".opciones-reportes__container");
        opsNav.forEach(ops => ops.classList.remove("dark-mode"));

        const opsAjustes = document.querySelectorAll(".ajustes-opt");
        opsAjustes.forEach(ops => ops.classList.remove("dark-mode"));

        const tiendaCard = document.querySelectorAll(".tienda-card");
        tiendaCard.forEach(card => card.classList.remove("dark-mode"));

    }
});


// Modo oscuro mobile
document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle_mobile");

    // Check localStorage and apply dark mode if enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            enableDarkMode();
            localStorage.setItem('darkMode', 'enabled');
        } else {
            disableDarkMode();
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('.styleIconMobile');
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

        const table = document.querySelectorAll(".table");
        table.forEach(table => table.classList.add("table-dark"));
        table.forEach(table => table.classList.add("table-bordered"));

        const opsNav = document.querySelectorAll(".opciones-reportes__container");
        opsNav.forEach(ops => ops.classList.add("dark-mode"));

        const opsAjustes = document.querySelectorAll(".ajustes-opt");
        opsAjustes.forEach(ops => ops.classList.add("dark-mode"));

        const tiendaCard = document.querySelectorAll(".tienda-card");
        tiendaCard.forEach(card => card.classList.add("dark-mode"));


    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

        const table = document.querySelectorAll(".table");
        table.forEach(table => table.classList.remove("table-dark"));
        table.forEach(table => table.classList.remove("table-bordered"));

        const opsNav = document.querySelectorAll(".opciones-reportes__container");
        opsNav.forEach(ops => ops.classList.remove("dark-mode"));

        const opsAjustes = document.querySelectorAll(".ajustes-opt");
        opsAjustes.forEach(ops => ops.classList.remove("dark-mode"));

        const tiendaCard = document.querySelectorAll(".tienda-card");
        tiendaCard.forEach(card => card.classList.remove("dark-mode"));

    }
});