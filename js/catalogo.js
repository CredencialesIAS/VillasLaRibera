
function crearTarjetaHTML(propiedad) {
  const portada = propiedad.galeria[0];
  return `
    <a class="tarjeta" href="detalle.html?id=${propiedad.id}">
      <div class="tarjeta-media">
        <img src="${portada.src}" alt="${portada.alt}" loading="lazy" />
      </div>
      <div class="tarjeta-cuerpo">
        <p class="tarjeta-ubicacion">${propiedad.ubicacion}</p>
        <h3 class="tarjeta-nombre">${propiedad.nombre}</h3>
        <p class="tarjeta-resumen">${propiedad.resumen}</p>
        <div class="tarjeta-meta">
          <span>${propiedad.huespedesMax} huéspedes</span>
          <span>${propiedad.recamaras} recámaras</span>
          <span>${propiedad.banos} baños</span>
        </div>
      </div>
    </a>
  `;
}

function renderizarCatalogo() {
  const contenedor = document.getElementById("grid-propiedades");
  if (contenedor) {
    contenedor.innerHTML = PROPIEDADES.map(crearTarjetaHTML).join("");
  }
}

document.addEventListener("DOMContentLoaded", renderizarCatalogo);