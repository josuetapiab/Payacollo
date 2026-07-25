/* ================================================
   main.js — Congreso Internacional para Mujeres
   Ministerio Misión Boliviana — Payacollo
   ================================================ */


/* ================================================
   1. ANIMACIÓN FADE-IN AL HACER SCROLL
   ------------------------------------------------
   Usa IntersectionObserver para detectar cuándo
   cada sección entra en la pantalla y le agrega
   la clase "visible", que activa la animación CSS.
   ================================================ */

// Seleccionamos todos los elementos con clase fade-in
const elementosAnimados = document.querySelectorAll('.fade-in');

// Creamos el observador
const observador = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      // Si el elemento ya es visible en pantalla...
      if (entrada.isIntersecting) {
        // Agregar clase "visible" para activar la animación CSS
        entrada.target.classList.add('visible');

        // Dejar de observar este elemento (la animación solo ocurre una vez)
        observador.unobserve(entrada.target);
      }
    });
  },
  {
    threshold: 0.15,               // Se activa cuando el 15% del elemento es visible
    rootMargin: '0px 0px -40px 0px' // Se activa un poco antes de llegar al borde inferior
  }
);

// Registrar cada elemento para ser observado
elementosAnimados.forEach(function (elemento) {
  observador.observe(elemento);
});


/* ================================================
   2. DROPDOWN DE WHATSAPP
   ------------------------------------------------
   Abre y cierra el menú al hacer clic en el botón.
   También cierra si el usuario:
     - Hace clic fuera del menú
     - Presiona la tecla Escape
   ================================================ */

// Referencias a los elementos del dropdown
const boton      = document.querySelector('.dropdown__toggle');
const menu       = document.querySelector('.dropdown__menu');
const contenedor = document.querySelector('.dropdown');

// Solo ejecutar si el dropdown existe en la página
if (boton && menu && contenedor) {

  /* --- Función: abrir el menú --- */
  function abrirMenu() {
    menu.removeAttribute('hidden');                    // Mostrar el menú
    boton.setAttribute('aria-expanded', 'true');       // Accesibilidad
    contenedor.classList.add('dropdown--open');        // Girar la flecha ▾ → ▴
  }

  /* --- Función: cerrar el menú --- */
  function cerrarMenu() {
    menu.setAttribute('hidden', '');                   // Ocultar el menú
    boton.setAttribute('aria-expanded', 'false');      // Accesibilidad
    contenedor.classList.remove('dropdown--open');     // Restaurar la flecha
  }

  /* --- Clic en el botón: alternar abierto/cerrado --- */
  boton.addEventListener('click', function (evento) {
    // Evitar que el clic llegue al documento (que cerraría el menú inmediatamente)
    evento.stopPropagation();

    // Si el menú NO tiene el atributo hidden, está abierto
    var estaAbierto = !menu.hasAttribute('hidden');

    if (estaAbierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  });

  /* --- Clic en cualquier parte fuera del dropdown: cerrar --- */
  document.addEventListener('click', function () {
    if (!menu.hasAttribute('hidden')) {
      cerrarMenu();
    }
  });

  /* --- Tecla Escape: cerrar y devolver el foco al botón --- */
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !menu.hasAttribute('hidden')) {
      cerrarMenu();
      boton.focus(); // devolver el foco al botón para accesibilidad con teclado
    }
  });

}
