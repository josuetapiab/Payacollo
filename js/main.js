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
   2. DROPDOWNS — Más información y Calendario
   Variables en scope global para que se puedan
   referenciar mutuamente al abrir/cerrar.
   ================================================ */
var infoBoton      = document.querySelector('.dropdown__toggle');
var infoMenu       = document.querySelector('.dropdown__toggle + .dropdown__menu');
var infoContenedor = infoBoton ? infoBoton.closest('.dropdown') : null;
var calToggle      = document.getElementById('calToggle');
var calMenu        = document.getElementById('calMenu');

/* --- Funciones de cierre individuales --- */
function cerrarInfo() {
  if (!infoMenu) return;
  infoMenu.setAttribute('hidden', '');
  if (infoBoton)      infoBoton.setAttribute('aria-expanded', 'false');
  if (infoContenedor) infoContenedor.classList.remove('dropdown--open');
}

function cerrarCal() {
  if (!calMenu) return;
  calMenu.setAttribute('hidden', '');
  if (calToggle) calToggle.setAttribute('aria-expanded', 'false');
}

/* Cierra TODOS los dropdowns de una vez */
function cerrarTodos() {
  cerrarInfo();
  cerrarCal();
}

/* --- Más información --- */
if (infoBoton && infoMenu) {
  infoBoton.addEventListener('click', function (e) {
    e.stopPropagation();
    if (infoMenu.hasAttribute('hidden')) {
      cerrarCal();                                /* cierra calendario si está abierto */
      infoMenu.removeAttribute('hidden');
      infoBoton.setAttribute('aria-expanded', 'true');
      infoContenedor.classList.add('dropdown--open');
    } else {
      cerrarInfo();
    }
  });
}

/* --- Calendario --- */
if (calToggle && calMenu) {
  calToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (calMenu.hasAttribute('hidden')) {
      cerrarInfo();                               /* cierra "Más información" si está abierto */
      calMenu.removeAttribute('hidden');
      calToggle.setAttribute('aria-expanded', 'true');
    } else {
      cerrarCal();
    }
  });
}

/* --- Cerrar al tocar/clicar FUERA (click = desktop, touchstart = móvil) --- */
function manejarCierreExterno(e) {
  var dentroInfo = infoBoton   && infoBoton.contains(e.target) ||
                   infoMenu    && infoMenu.contains(e.target);
  var dentroCal  = calToggle   && calToggle.contains(e.target) ||
                   calMenu     && calMenu.contains(e.target);
  if (!dentroInfo && !dentroCal) cerrarTodos();
}

document.addEventListener('click',      manejarCierreExterno);
document.addEventListener('touchstart', manejarCierreExterno, { passive: true });

/* --- Cerrar con Escape --- */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    cerrarTodos();
    if (infoBoton) infoBoton.focus();
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
   6. COMPARTIR EVENTO
   Usa Web Share API si está disponible; si no, abre
   WhatsApp con el texto prellenado.
   ================================================ */
var btnCompartir = document.getElementById('btnCompartir');
if (btnCompartir) {
  btnCompartir.addEventListener('click', function () {
    var datosCompartir = {
      title: 'Congreso Internacional para Mujeres — La Novia de Cristo',
      text:  '🔥😄 ¡Te quiero invitar a que participes de este evento! Este es el link:',
      url:   'https://josuetapiab.github.io/Payacollo/'
    };
    if (navigator.share) {
      navigator.share(datosCompartir).catch(function () {});
    } else {
      var texto = encodeURIComponent(datosCompartir.text + ' ' + datosCompartir.url);
      window.open('https://wa.me/?text=' + texto, '_blank', 'noopener');
    }
  });
}


/* ================================================
   7. FORMULARIO DE INSCRIPCIÓN RÁPIDA
   Arma el mensaje con los datos y abre WhatsApp
   con el chat y el texto ya listos para enviar.
   ================================================ */
var formInscripcion = document.getElementById('formInscripcion');
if (formInscripcion) {
  formInscripcion.addEventListener('submit', function (e) {
    e.preventDefault();

    var nombre        = document.getElementById('signupNombre').value.trim();
    var edad          = document.getElementById('signupEdad').value;
    var iglesia       = document.getElementById('signupIglesia').value.trim();
    var participantes = document.getElementById('signupParticipantes').value;
    var numero         = document.getElementById('signupContacto').value;

    var mensaje = 'Hola, quiero inscribirme al *Congreso Internacional para Mujeres "La Novia de Cristo"*\n\n' +
      '*Nombre:* ' + nombre + '\n' +
      '*Edad:* ' + edad + '\n' +
      '*Iglesia:* ' + iglesia + '\n' +
      '*Número de participantes:* ' + participantes;

    window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje), '_blank', 'noopener');
  });
}


/* ================================================
   8. ANIMACIÓN DE ENTRADA DEL HERO
   ================================================ */
function activarHero() {
  document.body.classList.add('hero-loaded');
}
window.addEventListener('load', activarHero);
setTimeout(activarHero, 1000);
