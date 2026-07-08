/**
 * catalogo.js
 * Genera las tarjetas de propiedades reales desde Supabase para la página principal.
 */

// ==========================================================================
// 1. IMPORTAR E INICIALIZAR SUPABASE
// ==========================================================================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://hjtofzyrpfkoyoeriqay.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zttTtLVuXQu3VrP0yLkbjA_Q_-eoVkV";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Conservamos intacta tu hermosa función de números romanos
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

// Adaptamos tu plantilla HTML para que lea los nombres de columna de Supabase
function crearTarjetaHTML(propiedad, indice) {
  // En Supabase guardamos un arreglo directo de URLs de fotos
  const listaFotos = Array.isArray(propiedad.fotos) ? propiedad.fotos : [];
  const fotoPortada = listaFotos[0] || 'img/logo.png';

  return `
    <a class="group block bg-white rounded-[1.75rem] overflow-hidden border border-neutral-200/60 shadow-sm hover:shadow-2xl hover:shadow-neutral-300/40 hover:-translate-y-1.5 transition-all duration-500 ease-out" href="detalle.html?id=${propiedad.id}">

      <div class="aspect-[4/3] overflow-hidden bg-neutral-100 relative">
        <img class="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out" src="${fotoPortada}" alt="${propiedad.nombre}" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <span class="absolute top-4 left-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-sm text-xs font-serif italic text-neutral-700">
          ${numeroRomano(indice + 1)}
        </span>
      </div>

      <div class="p-6 space-y-3">
        <p class="text-[11px] font-semibold tracking-[0.15em] text-neutral-400 uppercase">${propiedad.ubicacion}</p>
        <h3 class="text-xl font-medium text-neutral-950 tracking-tight font-serif leading-snug group-hover:text-neutral-700 transition-colors duration-300">${propiedad.nombre}</h3>
        
        <p class="text-sm text-neutral-500 font-light line-clamp-2 leading-relaxed">${propiedad.descripcion}</p>

        <div class="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-500">
          <span class="bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200/50">${propiedad.huespedes} huéspedes</span>
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

// ==========================================================================
// 2. FUNCIÓN ASÍNCRONA PARA TRAER DATOS DE INTERNET
// ==========================================================================
async function renderizarCatalogo() {
  const contenedor = document.getElementById("grid-propiedades");
  if (!contenedor) return;

  try {
    // Hacemos la consulta a Supabase ordenando por fecha de creación
    const { data: propiedades, error } = await supabase
      .from('propiedades')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    // Si la base de datos está vacía
    if (!propiedades || propiedades.length === 0) {
      contenedor.innerHTML = `
        <div class="col-span-full text-center text-neutral-400 font-light py-12">
          No hay villas disponibles en este momento. ¡Estamos preparando nuevas opciones!
        </div>
      `;
      actualizarContador(0);
      return;
    }

    // Mapeamos e inyectamos los datos reales en tu contenedor
    contenedor.innerHTML = propiedades.map((propiedad, indice) => crearTarjetaHTML(propiedad, indice)).join("");
    
    // Actualizamos tu contador con la cantidad real de filas
    actualizarContador(propiedades.length);

  } catch (error) {
    console.error("Error al cargar el catálogo desde Supabase:", error);
    contenedor.innerHTML = `
      <div class="col-span-full text-center text-red-500 font-light py-12">
        Error al conectar con el servidor. Por favor, recarga la página.
      </div>
    `;
  }
}

// Escuchador de carga de página
document.addEventListener("DOMContentLoaded", renderizarCatalogo);