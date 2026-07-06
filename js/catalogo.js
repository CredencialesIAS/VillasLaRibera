/**
 * catalogo.js
 * Genera las tarjetas de propiedades para la página principal.
 */

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

function crearTarjetaHTML(propiedad, indice) {
  const portada = propiedad.galeria[0];
  return `
    <a class="group block bg-white rounded-[1.75rem] overflow-hidden border border-neutral-200/60 shadow-sm hover:shadow-2xl hover:shadow-neutral-300/40 hover:-translate-y-1.5 transition-all duration-500 ease-out" href="detalle.html?id=${propiedad.id}">

      <div class="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
        <img class="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out" src="${portada.src}" alt="${portada.alt}" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <span class="absolute top-4 left-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-sm text-xs font-serif italic text-neutral-700">
          ${numeroRomano(indice + 1)}
        </span>
      </div>

      <div class="p-6 space-y-3">
        <p class="text-[11px] font-semibold tracking-[0.15em] text-neutral-400 uppercase">${propiedad.ubicacion}</p>
        <h3 class="text-xl font-medium text-neutral-950 tracking-tight font-serif leading-snug group-hover:text-neutral-700 transition-colors duration-300">${propiedad.nombre}</h3>
        <p class="text-sm text-neutral-500 font-light line-clamp-2 leading-relaxed">${propiedad.resumen}</p>

        <div class="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-500">
          <span class="bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200/50">${propiedad.huespedesMax} huéspedes</span>
          <span class="bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200/50">${propiedad.recamaras} recámaras</span>
          <span class="bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200/50">${propiedad.banos} baños</span>
        </div>

        <div class="pt-1 flex items-center text-sm font-medium text-neutral-900 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <span>Ver propiedad</span>
          <span class="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </div>
      </div>
    </a>
  `;
}

function actualizarContador(cantidad) {
  const contador = document.getElementById("contador-propiedades");
  if (contador) {
    contador.textContent = `${cantidad} ${cantidad === 1 ? "propiedad" : "propiedades"}`;
  }
}

function renderizarCatalogo() {
  const contenedor = document.getElementById("grid-propiedades");
  if (contenedor) {
    contenedor.innerHTML = PROPIEDADES.map((propiedad, indice) => crearTarjetaHTML(propiedad, indice)).join("");
  }
  actualizarContador(PROPIEDADES.length);
}

document.addEventListener("DOMContentLoaded", renderizarCatalogo);