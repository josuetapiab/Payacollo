/* ================================================
   main.js — Congreso Internacional para Mujeres
   Ministerio Misión Boliviana — Payacollo
   ================================================ */


/* ================================================
   1. ANIMACIÓN FADE-IN AL HACER SCROLL
   ================================================ */
var elementosAnimados = document.querySelectorAll('.fade-in');

var observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

elementosAnimados.forEach(function (el) { observador.observe(el); });


/* ================================================
   2. DROPDOWNS — WhatsApp y Calendario
   Variables en scope global para que se puedan
   referenciar mutuamente al abrir/cerrar.
   ================================================ */
var waBoton      = document.querySelector('.dropdown__toggle');
var waMenu       = document.querySelector('.dropdown__menu');
var waContenedor = document.querySelector('.dropdown');
var calToggle    = document.getElementById('calToggle');
var calMenu      = document.getElementById('calMenu');

/* --- Funciones de cierre individuales --- */
function cerrarWa() {
  if (!waMenu) return;
  waMenu.setAttribute('hidden', '');
  if (waBoton)      waBoton.setAttribute('aria-expanded', 'false');
  if (waContenedor) waContenedor.classList.remove('dropdown--open');
}

function cerrarCal() {
  if (!calMenu) return;
  calMenu.setAttribute('hidden', '');
  if (calToggle) calToggle.setAttribute('aria-expanded', 'false');
}

/* Cierra TODOS los dropdowns de una vez */
function cerrarTodos() {
  cerrarWa();
  cerrarCal();
}

/* --- WhatsApp --- */
if (waBoton && waMenu) {
  waBoton.addEventListener('click', function (e) {
    e.stopPropagation();
    if (waMenu.hasAttribute('hidden')) {
      cerrarCal();                              /* cierra calendario si está abierto */
      waMenu.removeAttribute('hidden');
      waBoton.setAttribute('aria-expanded', 'true');
      waContenedor.classList.add('dropdown--open');
    } else {
      cerrarWa();
    }
  });
}

/* --- Calendario --- */
if (calToggle && calMenu) {
  calToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (calMenu.hasAttribute('hidden')) {
      cerrarWa();                               /* cierra WhatsApp si está abierto */
      calMenu.removeAttribute('hidden');
      calToggle.setAttribute('aria-expanded', 'true');
    } else {
      cerrarCal();
    }
  });
}

/* --- Cerrar al tocar/clicar FUERA (click = desktop, touchstart = móvil) --- */
function manejarCierreExterno(e) {
  var dentroWa  = waBoton      && waBoton.contains(e.target)  ||
                  waMenu       && waMenu.contains(e.target);
  var dentroCal = calToggle    && calToggle.contains(e.target) ||
                  calMenu      && calMenu.contains(e.target);
  if (!dentroWa && !dentroCal) cerrarTodos();
}

document.addEventListener('click',      manejarCierreExterno);
document.addEventListener('touchstart', manejarCierreExterno, { passive: true });

/* --- Cerrar con Escape --- */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    cerrarTodos();
    if (waBoton) waBoton.focus();
  }
});


/* ================================================
   3. NAVBAR — transparente en el hero, sólida al bajar
   ================================================ */
var navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* Menú hamburguesa para móvil */
var burger  = document.getElementById('navBurger');
var navMenu = document.getElementById('navMenu');

if (burger && navMenu) {
  burger.addEventListener('click', function () {
    var abierto = navMenu.classList.toggle('navbar__menu--open');
    burger.setAttribute('aria-expanded', String(abierto));
    burger.classList.toggle('navbar__burger--open', abierto);
  });

  /* Cerrar al hacer clic en un enlace */
  navMenu.querySelectorAll('.navbar__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('navbar__menu--open');
      burger.classList.remove('navbar__burger--open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Cerrar al hacer clic/toque fuera de la navbar */
  document.addEventListener('click', function (e) {
    if (navMenu.classList.contains('navbar__menu--open') && !navbar.contains(e.target)) {
      navMenu.classList.remove('navbar__menu--open');
      burger.classList.remove('navbar__burger--open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('touchstart', function (e) {
    if (navMenu.classList.contains('navbar__menu--open') && !navbar.contains(e.target)) {
      navMenu.classList.remove('navbar__menu--open');
      burger.classList.remove('navbar__burger--open');
      burger.setAttribute('aria-expanded', 'false');
    }
  }, { passive: true });

  /* Cerrar con Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('navbar__menu--open')) {
      navMenu.classList.remove('navbar__menu--open');
      burger.classList.remove('navbar__burger--open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });
}


/* ================================================
   4. CONTADOR REGRESIVO
   Evento: 5 de septiembre 2026 a las 08:30 (Bolivia, UTC-4)
   En UTC equivale a las 12:30:00
   ================================================ */
var FECHA_EVENTO = new Date('2026-09-05T12:30:00Z');

var elDias  = document.getElementById('cd-dias');
var elHoras = document.getElementById('cd-horas');
var elMin   = document.getElementById('cd-min');
var elSeg   = document.getElementById('cd-seg');

function pad(n) { return String(n).padStart(2, '0'); }

function actualizarContador() {
  var diff = FECHA_EVENTO - new Date();

  if (diff <= 0) {
    if (elDias)  elDias.textContent  = '00';
    if (elHoras) elHoras.textContent = '00';
    if (elMin)   elMin.textContent   = '00';
    if (elSeg)   elSeg.textContent   = '00';
    return;
  }

  if (elDias)  elDias.textContent  = pad(Math.floor(diff / 86400000));
  if (elHoras) elHoras.textContent = pad(Math.floor((diff % 86400000) / 3600000));
  if (elMin)   elMin.textContent   = pad(Math.floor((diff % 3600000) / 60000));
  if (elSeg)   elSeg.textContent   = pad(Math.floor((diff % 60000) / 1000));
}

if (elDias) {
  actualizarContador();
  setInterval(actualizarContador, 1000);
}


/* ================================================
   5. ENLACE GOOGLE CALENDAR Y DESCARGA .ICS
   ================================================ */

/* Enlace de Google Calendar */
var btnGoogle = document.getElementById('calGoogle');
if (btnGoogle) {
  var params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     'Congreso Internacional para Mujeres — La Novia de Cristo',
    dates:    '20260905T123000Z/20260905T213000Z',
    details:  'Un tiempo de edificación, comunión y renovación espiritual. Organizado por el Ministerio Misión Boliviana Payacollo.',
    location: 'Iglesia Ministerio Misión Boliviana, Payacollo, Cochabamba, Bolivia'
  });
  btnGoogle.href = 'https://calendar.google.com/calendar/render?' + params.toString();
}

/* Descarga de archivo .ics (Apple Calendar / Outlook) */
var btnIcs = document.getElementById('calIcs');
if (btnIcs) {
  btnIcs.addEventListener('click', function () {
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MMB Payacollo//Congreso 2026//ES',
      'BEGIN:VEVENT',
      'DTSTART:20260905T123000Z',
      'DTEND:20260905T213000Z',
      'SUMMARY:Congreso Internacional para Mujeres — La Novia de Cristo',
      'DESCRIPTION:Un tiempo de edificación\\, comunión y renovación espiritual.\\nOrganizado por el Ministerio Misión Boliviana Payacollo.',
      'LOCATION:Iglesia Ministerio Misión Boliviana\\, Payacollo\\, Cochabamba\\, Bolivia',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href     = url;
    a.download = 'congreso-mmb-payacollo.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}


/* ================================================
   6. ANIMACIÓN DE ENTRADA DEL HERO
   ================================================ */
function activarHero() {
  document.body.classList.add('hero-loaded');
}
window.addEventListener('load', activarHero);
setTimeout(activarHero, 1000);
