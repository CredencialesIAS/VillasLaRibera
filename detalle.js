/**
 * detalle.js
 * Renderiza dinámicamente la propiedad usando Tailwind v4 premium y conecta el lightbox.
 */

function obtenerIdDesdeURL() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

function numeroRomano(numero) {
  const valores = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const simbolos = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let resto = numero;
  let resultado = "";
  for (let i = 0; i < valores.length; i++) {
    while (resto >= valores[i]) {
      resultado += simbolos[i];
      resto -= valores[i];
    }
  }
  return resultado;
}

function crearListaAmenidadesHTML(amenidades) {
  return amenidades.map((item) => `
    <li class="flex items-center space-x-3 text-neutral-600 bg-neutral-100/60 border border-neutral-200/50 rounded-xl px-4 py-3 text-sm font-light">
      <svg class="w-4 h-4 text-neutral-800 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${item}</span>
    </li>
  `).join("");
}

function crearGaleriaHTML(galeria) {
  if (galeria.length <= 1) return "";

  let html = '<div class="space-y-8 mt-10">';
  let categoriaActual = null;
  let contadorCategoria = 0;

  galeria.forEach((foto, index) => {
    if (foto.categoria !== categoriaActual) {
      if (categoriaActual !== null) html += "</div></div>";
      contadorCategoria += 1;
      html += `
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            
            <p class="text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">${foto.categoria}</p>
            <span class="h-px flex-1 bg-neutral-200/70"></span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">`;
      categoriaActual = foto.categoria;
    }
    html += `
      <button class="aspect-square bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200/50 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group cursor-pointer" type="button" data-index="${index}" aria-label="Ver foto ampliada: ${foto.alt}">
        <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${foto.src}" alt="${foto.alt}" loading="lazy" />
      </button>
    `;
  });

  html += "</div></div></div>";
  return html;
}

function crearFormularioHTML(propiedad) {
  return `
    <aside class="bg-white border border-neutral-200/70 rounded-[1.75rem] p-6 md:p-8 shadow-sm lg:sticky lg:top-28 space-y-6">
      <div class="space-y-1">
        <h2 class="text-xl font-semibold text-neutral-950 tracking-tight font-serif">Solicitar información</h2>
        <p class="text-xs text-neutral-400 font-light">Verifica disponibilidad al instante</p>
      </div>

      <form id="form-solicitud" class="space-y-4" novalidate>
        <div class="space-y-2">
          <label class="block text-xs font-semibold tracking-wider text-neutral-500 uppercase" for="huespedes">Número de huéspedes</label>
          <div class="relative">
            <select id="huespedes" name="huespedes" class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-colors duration-200 appearance-none cursor-pointer" required>
              ${Array.from({ length: propiedad.huespedesMax }, (_, i) => i + 1)
                .map((n) => `<option value="${n}">${n} ${n === 1 ? "huésped" : "huéspedes"}</option>`)
                .join("")}
            </select>
            <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 text-xs">&#9662;</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label class="block text-xs font-semibold tracking-wider text-neutral-500 uppercase" for="check-in">Check-in</label>
            <input type="date" id="check-in" name="checkIn" class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-3 text-xs sm:text-sm sm:px-4 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-colors duration-200" required />
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-semibold tracking-wider text-neutral-500 uppercase" for="check-out">Check-out</label>
            <input type="date" id="check-out" name="checkOut" class="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-3 text-xs sm:text-sm sm:px-4 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950 transition-colors duration-200" required />
          </div>
        </div>

        <p class="text-xs text-red-600 font-medium hidden" id="mensaje-error" role="alert"></p>

        <button type="submit" class="w-full bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl py-3.5 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-neutral-950/20 flex items-center justify-center space-x-2 cursor-pointer mt-2">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.411 0 11.989 0c3.183.001 6.177 1.243 8.43 3.496 2.253 2.253 3.493 5.249 3.493 8.432 0 6.583-5.352 11.933-11.933 11.933-2.006-.002-3.98-.507-5.732-1.464L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.803 1.453 5.426 0 9.842-4.414 9.845-9.843.002-2.63-1.023-5.101-2.886-6.964a9.77 9.77 0 0 0-6.962-2.88c-5.433 0-9.851 4.417-9.854 9.846-.001 1.682.449 3.323 1.302 4.773L1.696 21.394l4.951-1.24z"/></svg>
          <span>Consultar por WhatsApp</span>
        </button>
        <p class="text-[11px] text-center text-neutral-400 font-light leading-snug">Te responderemos directo por WhatsApp, sin costo ni compromiso alguno.</p>
      </form>
    </aside>
  `;
}

function crearDetalleHTML(propiedad) {
  const portada = propiedad.galeria[0];

  const mapaHTML = propiedad.mapaUrl
    ? `<div class="rounded-[1.75rem] overflow-hidden border border-neutral-200/70 shadow-inner mt-8">
         <iframe src="${propiedad.mapaUrl}" width="100%" height="320" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
       </div>`
    : '';

  return `
    <button class="w-full aspect-[16/8] md:aspect-[21/9] rounded-[1.75rem] overflow-hidden bg-neutral-100 block border border-neutral-200/50 relative group cursor-pointer" type="button" data-index="0" aria-label="Ver foto ampliada: ${portada.alt}">
      <img class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out" src="${portada.src}" alt="${portada.alt}" />
      <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent group-hover:from-neutral-950/5 transition-colors duration-300"></div>
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 items-start">

      <div class="lg:col-span-2 space-y-8">
        <div class="space-y-2">
          <p class="text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">${propiedad.ubicacion}</p>
          <h1 class="text-3xl md:text-5xl font-light tracking-tight text-neutral-950 font-serif leading-tight">${propiedad.nombre}</h1>
        </div>

        <div class="grid grid-cols-3 gap-4 border-y border-neutral-200/60 py-6">
          <div class="text-center bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
            <span class="block text-2xl font-semibold text-neutral-950 font-serif">${propiedad.huespedesMax}</span>
            <span class="block text-[10px] font-medium text-neutral-400 tracking-wider uppercase mt-1">Huéspedes</span>
          </div>
          <div class="text-center bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
            <span class="block text-2xl font-semibold text-neutral-950 font-serif">${propiedad.recamaras}</span>
            <span class="block text-[10px] font-medium text-neutral-400 tracking-wider uppercase mt-1">Recámaras</span>
          </div>
          <div class="text-center bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
            <span class="block text-2xl font-semibold text-neutral-950 font-serif">${propiedad.banos}</span>
            <span class="block text-[10px] font-medium text-neutral-400 tracking-wider uppercase mt-1">Baños</span>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">Sobre este espacio</p>
          <p class="text-neutral-600 font-light leading-relaxed text-base md:text-lg whitespace-pre-line">${propiedad.descripcion}</p>
        </div>

        ${mapaHTML}

        <div class="space-y-4 pt-4">
          <p class="text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">Amenidades incluidas</p>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${crearListaAmenidadesHTML(propiedad.amenidades)}
          </ul>
        </div>

        ${crearGaleriaHTML(propiedad.galeria)}
      </div>

      <div class="lg:col-span-1">
        ${crearFormularioHTML(propiedad)}
      </div>

    </div>
  `;
}

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

  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("check-in").setAttribute("min", hoy);
  document.getElementById("check-out").setAttribute("min", hoy);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const huespedes = document.getElementById("huespedes").value;
    const checkIn = document.getElementById("check-in").value;
    const checkOut = document.getElementById("check-out").value;

    const error = validarFechas(checkIn, checkOut);

    if (error) {
      mensajeError.textContent = error;
      mensajeError.classList.remove("hidden");
      return;
    }

    mensajeError.classList.add("hidden");

    redirigirAWhatsapp({
      nombreDepartamento: propiedad.nombre,
      checkIn,
      checkOut,
      huespedes
    });
  });
}

/* ==========================================================================
   MÓDULO LIGHTBOX JS
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

function inicializarClicsGaleria(propiedad) {
  const disparadores = document.querySelectorAll("button[data-index]");
  disparadores.forEach((el) => {
    el.addEventListener("click", () => {
      const indice = Number(el.getAttribute("data-index"));
      abrirLightbox(propiedad.galeria, indice);
    });
  });
}

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
      <div class="text-center py-24 space-y-5">
        <p class="text-neutral-500 font-light font-serif italic text-lg">No encontramos la propiedad que estás buscando.</p>
        <a href="index.html" class="inline-block bg-neutral-950 hover:bg-neutral-800 text-white text-sm px-6 py-2.5 rounded-xl font-medium transition-colors duration-200">Volver al catálogo</a>
      </div>
    `;
    return;
  }

  document.title = `${propiedad.nombre} · Villas La Ribera`;
  contenedor.innerHTML = crearDetalleHTML(propiedad);
  inicializarFormulario(propiedad);
  inicializarClicsGaleria(propiedad);
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarDetalle();
  inicializarControlesLightbox();
});