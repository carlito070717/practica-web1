// script.js

// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    /** -------------------------
     *  1. Scroll suave del menú
     * -------------------------- */
    const menuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const id = link.getAttribute("href").substring(1); // quitar el #
            const target = document.getElementById(id);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    /** --------------------------------------
     *  2. Botón "PRÓXIMAS PELEAS" -> scroll
     * -------------------------------------- */
    const btnProximas = document.querySelector(".btn-secondary");
    if (btnProximas) {
        btnProximas.addEventListener("click", () => {
            // Si tienes sección #noticias la usa, si no, manda a #eventos
            const destino = document.getElementById("noticias") || document.getElementById("eventos");
            if (destino) {
                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                alert("Próximamente: sección de próximas peleas 🔥");
            }
        });
    }

    /** -------------------------------------------
     *  3. Navbar que cambia al hacer scroll
     * -------------------------------------------- */
    const navbar = document.querySelector(".navbar");

    const actualizarNavbar = () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add("navbar-scroll");
        } else {
            navbar.classList.remove("navbar-scroll");
        }
    };

    window.addEventListener("scroll", actualizarNavbar);
    actualizarNavbar(); // llamar una vez al inicio

    /** -------------------------------------------
     *  4. Contador animado en estadísticas
     * -------------------------------------------- */
    const statElements = document.querySelectorAll(".stat-number");

    // Función para animar un número
    const animarNumero = (element, duracion = 1500) => {
        const textoOriginal = element.textContent.trim();
        const sufijo = textoOriginal.replace(/[0-9]/g, ""); // ej: "+", "M+"
        const soloNumeros = textoOriginal.replace(/\D/g, ""); // solo dígitos
        const valorFinal = parseInt(soloNumeros, 10);

        if (isNaN(valorFinal)) return;

        let inicio = 0;
        const inicioTiempo = performance.now();

        const actualizar = (tiempoActual) => {
            const progreso = Math.min((tiempoActual - inicioTiempo) / duracion, 1);
            const valorActual = Math.floor(progreso * valorFinal);
            element.textContent = valorActual.toLocaleString() + sufijo;

            if (progreso < 1) {
                requestAnimationFrame(actualizar);
            }
        };

        requestAnimationFrame(actualizar);
    };

    // Usamos IntersectionObserver para que solo anime cuando se vean
    const statsSection = document.querySelector(".stats-section");
    if (statsSection && statElements.length > 0) {
        let yaAnimado = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !yaAnimado) {
                    yaAnimado = true;
                    statElements.forEach(el => animarNumero(el));
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(statsSection);
    }
});

/** ------------------------------------------------
 *  5. Función global cambiarImagen() para el botón
 *     "VER EVENTOS"
 *     (se llama desde el HTML con onclick="")
 * ------------------------------------------------- */
let indiceBanner = 0;

// Ajusta las rutas a las imágenes que tengas en tu carpeta img/
const imagenesBanner = [
    "img/webimg.jpg",     // imagen inicial
    "img/evento1.jpg",    // puedes cambiar estos nombres
    "img/evento2.jpg"
];

function cambiarImagen() {
    const banner = document.getElementById("banner");
    const eventosSection = document.getElementById("eventos");

    if (!banner) return;

    // Cambiar a la siguiente imagen
    indiceBanner = (indiceBanner + 1) % imagenesBanner.length;
    banner.src = imagenesBanner[indiceBanner];

    // Pequeño efecto visual (si luego lo manejas con CSS)
    banner.classList.add("banner-change");
    setTimeout(() => {
        banner.classList.remove("banner-change");
    }, 400);

    // Hacer scroll suave hacia la sección de eventos
    if (eventosSection) {
        eventosSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// Hacerla accesible desde el HTML (onclick)
window.cambiarImagen = cambiarImagen;
