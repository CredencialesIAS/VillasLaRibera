/**
 * detalle.js
 * Obtiene el id de la propiedad desde la URL (?id=...), la busca en
 * PROPIEDADES (data.js) y renderiza el detalle junto con el formulario
 * de solicitud. Al enviar el formulario, construye el mensaje y
 * redirige a WhatsApp usando la función de whatsapp.js.
 */

function obtenerIdDesdeURL() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

function crearListaAmenidadesHTML(amenidades) {
  return amenidades.map((item) => `<li>${item}</li>`).join("");
}

/**
 * Construye la cuadrícula de fotos agrupada por categoría (Alberca, Cocina,
 * Recámaras, etc). Si la propiedad solo tiene una foto, no se muestra
 * cuadrícula adicional (ya se ve como imagen principal).
 */
function crearGaleriaHTML(galeria) {
  if (galeria.length <= 1) return "";

  let html = '<div class="galeria">';
  let categoriaActual = null;

  galeria.forEach((foto, index) => {
    if (foto.categoria !== categoriaActual) {
      if (categoriaActual !== null) html += "</div>";
      html += `<p class="galeria-categoria-titulo">${foto.categoria}</p><div class="galeria-grid">`;
      categoriaActual = foto.categoria;
    }
    html += `
      <button class="galeria-thumb" type="button" data-index="${index}" aria-label="Ver foto ampliada: ${foto.alt}">
        <img src="${foto.src}" alt="${foto.alt}" loading="lazy" />
      </button>
    `;
  });

  html += "</div></div>";
  return html;
}

function crearFormularioHTML(propiedad) {
  return `
    <aside class="panel-formulario">
      <h2>Solicitar información</h2>
     

      <form id="form-solicitud" novalidate>
        <div class="campo">
          <label for="huespedes">Número de huéspedes</label>
          <select id="huespedes" name="huespedes" required>
            ${Array.from({ length: propiedad.huespedesMax }, (_, i) => i + 1)
              .map((n) => `<option value="${n}">${n} ${n === 1 ? "huésped" : "huéspedes"}</option>`)
              .join("")}
          </select>
        </div>

        <div class="fila-fechas">
          <div class="campo">
            <label for="check-in">Check-in</label>
            <input type="date" id="check-in" name="checkIn" required />
          </div>
          <div class="campo">
            <label for="check-out">Check-out</label>
            <input type="date" id="check-out" name="checkOut" required />
          </div>
        </div>
        <p class="error-fecha" id="mensaje-error" role="alert"></p>

        <button type="submit" class="btn-whatsapp">
          Solicitar información por WhatsApp
        </button>
        <p class="nota-formulario">Te responderemos directo por WhatsApp, sin costo ni compromiso.</p>
      </form>
    </aside>
  `;
}

function crearDetalleHTML(propiedad) {
  const portada = propiedad.galeria[0];
  
  // Generación dinámica del contenedor del mapa si existe la URL
  const mapaHTML = propiedad.mapaUrl 
    ? `<div class="detalle-mapa">
         <iframe src="${propiedad.mapaUrl}" width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
       </div>` 
    : '';

  return `
    <button class="detalle-media" type="button" data-index="0" aria-label="Ver foto ampliada: ${portada.alt}">
      <img src="${portada.src}" alt="${portada.alt}" />
    </button>

    ${crearGaleriaHTML(propiedad.galeria)}

    <div class="detalle-layout">
      <div>
        <p class="detalle-ubicacion">${propiedad.ubicacion}</p>
        <h1 class="detalle-nombre">${propiedad.nombre}</h1>
        <p class="detalle-descripcion">${propiedad.descripcion}</p>

        ${mapaHTML}

        <div class="detalle-datos">
          <div class="dato">
            <span class="dato-numero">${propiedad.huespedesMax}</span>
            <span class="dato-label">Huéspedes</span>
          </div>
          <div class="dato">
            <span class="dato-numero">${propiedad.recamaras}</span>
            <span class="dato-label">Recámaras</span>
          </div>
          <div class="dato">
            <span class="dato-numero">${propiedad.banos}</span>
            <span class="dato-label">Baños</span>
          </div>
        </div>

        <p class="amenidades-titulo">Amenidades</p>
        <ul class="lista-amenidades">
          ${crearListaAmenidadesHTML(propiedad.amenidades)}
        </ul>
      </div>

      ${crearFormularioHTML(propiedad)}
    </div>
  `;
}

/**
 * Valida que ambas fechas estén presentes y que el check-out sea
 * posterior al check-in. Devuelve un string con el error, o "" si es válido.
 */
function validarFechas(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return "Selecciona la fecha de entrada y de salida.";
  }
  if (checkOut <= checkIn) {
    return "La fecha de salida debe ser posterior a la de entrada.";
  }
  return "";
}

function inicializarFormulario(propiedad) {
  const formulario = document.getElementById("form-solicitud");
  const mensajeError = document.getElementById("mensaje-error");

  // No permitir seleccionar fechas pasadas.
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("check-in").setAttribute("min", hoy);
  document.getElementById("check-out").setAttribute("min", hoy);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const huespedes = document.getElementById("huespedes").value;
    const checkIn = document.getElementById("check-in").value;
    const checkOut = document.getElementById("check-out").value;

    const error = validarFechas(checkIn, checkOut);
    mensajeError.textContent = error;
    if (error) return;

    redirigirAWhatsapp({
      nombreDepartamento: propiedad.nombre,
      checkIn,
      checkOut,
      huespedes
    });
  });
}

/* ==========================================================================
   LIGHTBOX: visor de fotos en grande con navegación anterior/siguiente
   ========================================================================== */

let galeriaActual = [];
let indiceActual = 0;

function actualizarLightbox() {
  const foto = galeriaActual[indiceActual];
  document.getElementById("lightbox-img").src = foto.src;
  document.getElementById("lightbox-img").alt = foto.alt;
  document.getElementById("lightbox-contador").textContent = `${indiceActual + 1} / ${galeriaActual.length}`;
}

function abrirLightbox(galeria, indiceInicial) {
  galeriaActual = galeria;
  indiceActual = indiceInicial;
  actualizarLightbox();
  document.getElementById("lightbox").hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarLightbox() {
  document.getElementById("lightbox").hidden = true;
  document.body.style.overflow = "";
}

function fotoSiguiente() {
  indiceActual = (indiceActual + 1) % galeriaActual.length;
  actualizarLightbox();
}

function fotoAnterior() {
  indiceActual = (indiceActual - 1 + galeriaActual.length) % galeriaActual.length;
  actualizarLightbox();
}

/** Conecta los clics en la imagen principal y en la cuadrícula al lightbox. */
function inicializarClicsGaleria(propiedad) {
  const disparadores = document.querySelectorAll(".detalle-media, .galeria-thumb");
  disparadores.forEach((el) => {
    el.addEventListener("click", () => {
      const indice = Number(el.getAttribute("data-index"));
      abrirLightbox(propiedad.galeria, indice);
    });
  });
}

/** Conecta los controles del lightbox (cerrar, flechas, teclado). Se llama una sola vez. */
function inicializarControlesLightbox() {
  document.getElementById("lightbox-cerrar").addEventListener("click", cerrarLightbox);
  document.getElementById("lightbox-siguiente").addEventListener("click", fotoSiguiente);
  document.getElementById("lightbox-anterior").addEventListener("click", fotoAnterior);

  document.getElementById("lightbox").addEventListener("click", (evento) => {
    if (evento.target.id === "lightbox") cerrarLightbox();
  });

  document.addEventListener("keydown", (evento) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox.hidden) return;
    if (evento.key === "Escape") cerrarLightbox();
    if (evento.key === "ArrowRight") fotoSiguiente();
    if (evento.key === "ArrowLeft") fotoAnterior();
  });
}

function renderizarDetalle() {
  const id = obtenerIdDesdeURL();
  const propiedad = obtenerPropiedadPorId(id);
  const contenedor = document.getElementById("contenido-detalle");

  if (!propiedad) {
    contenedor.innerHTML = `
      <p>No encontramos esta propiedad. <a href="index.html">Vuelve al catálogo</a>.</p>
    `;
    return;
  }

  document.title = `${propiedad.nombre} · Estancias`;
  contenedor.innerHTML = crearDetalleHTML(propiedad);
  inicializarFormulario(propiedad);
  inicializarClicsGaleria(propiedad);
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarDetalle();
  inicializarControlesLightbox();
});