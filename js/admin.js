// ==========================================================================
// 1. IMPORTAR SUPABASE
// ==========================================================================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://hjtofzyrpfkoyoeriqay.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zttTtLVuXQu3VrP0yLkbjA_Q_-eoVkV";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================================================
const vistaLogin = document.getElementById('vista-login');
const vistaAdmin = document.getElementById('vista-admin');
const formLogin = document.getElementById('form-login');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btn-logout');

const formPropiedad = document.getElementById('form-propiedad');
const listaPropiedades = document.getElementById('lista-propiedades');
const modalPropiedad = document.getElementById('modal-propiedad');
const modalTitulo = document.getElementById('modal-titulo');
const inputFotos = document.getElementById('prop-fotos');
const listaPrevia = document.getElementById('lista-previa-fotos');
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const modalOverlay = document.getElementById('modal-overlay');
const contenedorImagenesEdit = document.getElementById('contenedor-imagenes-edit');

let propiedadesLocales = []; // Guarda las propiedades en memoria para evitar consultas duplicadas
let ejecutandoCarga = false;

// ==========================================================================
// 3. CONTROL DE ACCESO
// ==========================================================================
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    vistaLogin.classList.add('hidden');
    vistaAdmin.classList.remove('hidden');
    cargarPropiedades();
  } else {
    vistaAdmin.classList.add('hidden');
    vistaLogin.classList.remove('hidden');
  }
});

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.classList.add('hidden');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btnSubmit = formLogin.querySelector('button[type="submit"]');

  try {
    btnSubmit.disabled = true;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    formLogin.reset();
  } catch (error) {
    loginError.classList.remove('hidden');
    loginError.innerText = "Correo o contraseña incorrectos.";
  } finally {
    btnSubmit.disabled = false;
  }
});

btnLogout.addEventListener('click', async () => await supabase.auth.signOut());

// ==========================================================================
// 4. GESTIÓN DEL MODAL
// ==========================================================================
function abrirModal() {
  document.getElementById('id-en-edicion').value = '';
  formPropiedad.reset();
  modalTitulo.textContent = "Publicar Nueva Propiedad";
  listaPrevia.innerHTML = '';
  if (contenedorImagenesEdit) contenedorImagenesEdit.innerHTML = ''; 
  modalPropiedad.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  modalPropiedad.classList.add('hidden');
  document.body.style.overflow = '';
  formPropiedad.reset();
  document.getElementById('id-en-edicion').value = '';
  listaPrevia.innerHTML = '';
  if (contenedorImagenesEdit) contenedorImagenesEdit.innerHTML = ''; 
}

btnAbrirModal.addEventListener('click', abrirModal);
btnCerrarModal.addEventListener('click', cerrarModal);
modalOverlay.addEventListener('click', cerrarModal);

inputFotos.addEventListener('change', () => {
  listaPrevia.innerHTML = '';
  if (inputFotos.files.length > 0) {
    listaPrevia.innerHTML = `<strong>Archivos Nuevos a subir (${inputFotos.files.length}):</strong>`;
    Array.from(inputFotos.files).forEach(file => {
      listaPrevia.innerHTML += `<div class="truncate text-neutral-400">· ${file.name}</div>`;
    });
  }
});

// ==========================================================================
// 5. LÓGICA DE GUARDAR (INSERT / UPDATE)
// ==========================================================================
formPropiedad.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id-en-edicion').value;
  const btnGuardar = formPropiedad.querySelector('button[type="submit"]');
  
  let urlsFotosNuevas = [];
  if (inputFotos.files.length > 0) {
    btnGuardar.innerText = "Subiendo imágenes...";
    for (const file of inputFotos.files) {
      const nombreArchivo = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage.from('propiedades').upload(nombreArchivo, file);
      if (error) {
        console.error("Error al subir imagen:", error);
        return alert("Error al subir imagen");
      }
      const { data: urlData } = supabase.storage.from('propiedades').getPublicUrl(nombreArchivo);
      urlsFotosNuevas.push(urlData.publicUrl);
    }
  }

  const datos = {
    nombre: document.getElementById('prop-nombre').value.trim(),
    ubicacion: document.getElementById('prop-ubicacion').value.trim(),
    descripcion: document.getElementById('prop-descripcion').value.trim(),
    mapa_url: document.getElementById('prop-mapa').value.trim() || null,
    huespedes: parseInt(document.getElementById('prop-huespedes').value) || 0,
    recamaras: parseInt(document.getElementById('prop-recamaras').value) || 0,
    banos: parseFloat(document.getElementById('prop-banos').value) || 0,
    amenidades: Array.from(document.querySelectorAll('input[name="amenidades"]:checked')).map(c => c.value),
  };

  try {
    btnGuardar.disabled = true;
    btnGuardar.innerText = "Guardando...";

    let response;
    if (id) {
      const { data: propActual } = await supabase.from('propiedades').select('fotos').eq('id', id).single();
      const fotosAnteriores = propActual.fotos || [];
      datos.fotos = [...fotosAnteriores, ...urlsFotosNuevas];
      response = await supabase.from('propiedades').update(datos).eq('id', id);
    } else {
      datos.fotos = urlsFotosNuevas;
      datos.fecha_creacion = Date.now();
      response = await supabase.from('propiedades').insert([datos]);
    }

    const { error } = response;
    if (error) {
      console.error("DETALLE DEL ERROR DE SUPABASE:", error);
      alert("Error en base de datos: " + error.message);
    } else {
      alert(id ? "Propiedad actualizada correctamente." : "Propiedad creada.");
      cerrarModal();
      await cargarPropiedades();
    }
  } catch (error) {
    console.error("Error general:", error);
  } finally {
    btnGuardar.disabled = false;
    btnGuardar.innerText = "Guardar Propiedad";
  }
});

// ==========================================================================
// 6. RENDERIZADO Y CONTROLADORES INTERNOS (DELEGACIÓN DE EVENTOS)
// ==========================================================================
async function cargarPropiedades() {
  if (ejecutandoCarga) return;
  ejecutandoCarga = true;

  const { data: propiedades, error } = await supabase
    .from('propiedades')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) { console.error("Error al cargar:", error); return; }

  propiedadesLocales = propiedades || []; // Sincronizamos la memoria local

  listaPropiedades.innerHTML = propiedadesLocales.map(villa => `
    <div class="bg-white border border-neutral-200/70 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div class="aspect-[16/10] bg-neutral-100 relative">
        <img src="${(Array.isArray(villa.fotos) && villa.fotos.length > 0) ? villa.fotos[0] : 'logo.png'}" class="w-full h-full object-cover" />
      </div>
      <div class="p-5 flex-1 space-y-2">
        <h3 class="text-lg font-medium font-serif">${villa.nombre}</h3>
        <p class="text-xs text-neutral-400 line-clamp-2">${villa.descripcion}</p>
        <div class="flex items-center space-x-2 pt-4">
          <button data-id="${villa.id}" data-action="editar" class="text-xs font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-neutral-100">Editar</button>
          <button data-id="${villa.id}" data-action="eliminar" class="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-red-100">Eliminar</button>
        </div>
      </div>
    </div>
  `).join('');
  ejecutandoCarga = false;
}

// Escuchador inteligente para la lista de propiedades (Evita desconexiones por módulo)
// Escuchador inteligente para la lista de propiedades (Con Diagnóstico)
listaPropiedades.addEventListener('click', (e) => {
  console.log("--- NUEVO CLIC DETECTADO ---");
  
  const boton = e.target.closest('button');
  
  if (!boton) {
    console.log("❌ Clic ignorado: No se hizo clic dentro de un botón.");
    return;
  }

  const action = boton.dataset.action;
  const id = boton.dataset.id;
  
  console.log(`✅ Botón detectado -> Acción: ${action} | ID: ${id}`);
  console.log("📦 Total de propiedades en memoria:", propiedadesLocales.length);

  // Forzamos la comparación a texto
  const villa = propiedadesLocales.find(v => String(v.id) === String(id)); 
  
  if (!villa) {
    console.log("❌ Error crítico: No se encontró ninguna propiedad con el ID", id, "en la memoria local.");
    console.log("Contenido actual de la memoria:", propiedadesLocales);
    alert("Error de sincronización. Recarga la página por favor.");
    return;
  }

  console.log("✅ Propiedad encontrada en memoria:", villa.nombre);

  if (action === 'editar') {
    console.log("🚀 Ejecutando función abrirEditarPropiedad()...");
    abrirEditarPropiedad(villa);
  } else if (action === 'eliminar') {
    ejecutarBorradoPropiedad(villa.id, villa.nombre);
  }
});

// ==========================================================================
// 7. GESTIÓN DE ELIMINACIÓN DE IMÁGENES
// ==========================================================================
// ==========================================================================
// 7. GESTIÓN DE ELIMINACIÓN DE IMÁGENES (Versión Ultra-Compatible Móvil)
// ==========================================================================
function mostrarImagenesParaEditar(urls) {
  // Buscamos el elemento directamente aquí dentro para evitar errores de carga en celulares
  const contenedor = document.getElementById('contenedor-imagenes-edit');
  if (!contenedor) return; 

  contenedor.innerHTML = ''; 

  // 1. Forzamos que las URLs sean un arreglo válido por si llega nulo o vacío
  let listaUrls = [];
  if (Array.isArray(urls)) {
    listaUrls = urls;
  } else if (typeof urls === 'string' && urls.trim() !== '') {
    try {
      listaUrls = JSON.parse(urls);
    } catch (e) {
      listaUrls = urls.split(',').map(u => u.trim());
    }
  }

  // 2. Si NO hay imágenes, pintamos un aviso directo en la pantalla del celular
  if (!Array.isArray(listaUrls) || listaUrls.length === 0) {
    contenedor.innerHTML = `
      <div class="bg-neutral-50 border border-neutral-200 p-4 rounded-xl text-center mt-2">
        <p class="text-xs text-neutral-400">🫙 Esta propiedad no tiene imágenes registradas actualmente.</p>
      </div>
    `;
    return;
  }

  // 3. Si SÍ hay imágenes, creamos la cuadrícula adaptada a pantallas táctiles
  contenedor.innerHTML = `
    <h4 class="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
      <span>🖼️</span> Imágenes actuales <span class="text-[10px] font-normal text-neutral-400">(Toca la X para eliminar)</span>
    </h4>
  `;
  
  const divGrid = document.createElement('div');
  // grid-cols-3 asegura que en cualquier celular se vean 3 imágenes por fila ordenadas
  divGrid.className = 'grid grid-cols-3 sm:grid-cols-5 gap-3 bg-neutral-50 border border-neutral-200 p-3 rounded-xl';

  listaUrls.forEach((url) => {
    if (!url) return;
    const div = document.createElement('div');
    div.className = "relative aspect-square overflow-visible";
    div.innerHTML = `
      <img src="${url}" class="w-full h-full object-cover rounded-lg shadow-sm border border-neutral-200 block" />
      <button type="button" data-url="${url}" data-action="eliminar-foto" class="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-md border border-white active:bg-red-600 touch-manipulation">
        ✕
      </button>
    `;
    divGrid.appendChild(div);
  });

  contenedor.appendChild(divGrid);
}

// Escuchador global para eliminar fotos, protegido para pantallas táctiles
document.addEventListener('click', async (e) => {
  const boton = e.target.closest('button');
  if (!boton || boton.dataset.action !== 'eliminar-foto') return;

  const urlCompleta = boton.dataset.url;
  if (!confirm("¿Seguro que quieres eliminar esta imagen? Esta acción no se puede deshacer.")) return;

  const id = document.getElementById('id-en-edicion').value;
  if (!id) return alert("Hubo un error recuperando el ID de la propiedad.");

  const nombreArchivo = urlCompleta.split('/').pop(); 

  const { error: errorStorage } = await supabase.storage.from('propiedades').remove([nombreArchivo]); 
  if (errorStorage) {
    console.error('Error al borrar de Storage:', errorStorage);
    return alert("Error al eliminar la imagen del servidor.");
  }

  const { data: propiedad, error: errorSelect } = await supabase.from('propiedades').select('fotos').eq('id', id).single();
  if (errorSelect) return alert("Error al actualizar los datos.");

  const nuevasFotos = (propiedad.fotos || []).filter(fotoUrl => fotoUrl !== urlCompleta);

  const { error: errorUpdate } = await supabase.from('propiedades').update({ fotos: nuevasFotos }).eq('id', id);
  if (errorUpdate) return alert("Error al guardar cambios en la base de datos.");

  if (typeof propiedadesLocales !== 'undefined') {
    const propiedadLocal = propiedadesLocales.find(v => String(v.id) === String(id));
    if (propiedadLocal) propiedadLocal.fotos = nuevasFotos;
  }

  mostrarImagenesParaEditar(nuevasFotos);
  if (typeof cargarPropiedades === 'function') await cargarPropiedades();
});

// Escuchador inteligente para eliminar imágenes dentro del contenedor
if (contenedorImagenesEdit) {
  contenedorImagenesEdit.addEventListener('click', async (e) => {
    const boton = e.target.closest('button');
    if (!boton || boton.dataset.action !== 'eliminar-foto') return;

    const urlCompleta = boton.dataset.url;
    if (!confirm("¿Seguro que quieres eliminar esta imagen? Esta acción no se puede deshacer.")) return;

    const id = document.getElementById('id-en-edicion').value;
    if (!id) return alert("Hubo un error recuperando el ID de la propiedad.");

    const nombreArchivo = urlCompleta.split('/').pop(); 

    const { error: errorStorage } = await supabase.storage.from('propiedades').remove([nombreArchivo]); 
    if (errorStorage) {
      console.error('Error al borrar de Storage:', errorStorage);
      return alert("Error al eliminar la imagen del servidor.");
    }

    const { data: propiedad, error: errorSelect } = await supabase.from('propiedades').select('fotos').eq('id', id).single();
    if (errorSelect) return alert("Error al actualizar los datos.");

    const nuevasFotos = (propiedad.fotos || []).filter(fotoUrl => fotoUrl !== urlCompleta);

    const { error: errorUpdate } = await supabase.from('propiedades').update({ fotos: nuevasFotos }).eq('id', id);
    if (errorUpdate) return alert("Error al guardar cambios en la base de datos.");

    // Buscamos la propiedad en memoria local para actualizar sus fotos al instante sin recargar la página entera
    const propiedadLocal = propiedadesLocales.find(v => v.id === id);
    if (propiedadLocal) propiedadLocal.fotos = nuevasFotos;

    mostrarImagenesParaEditar(nuevasFotos);
    await cargarPropiedades();
  });
}
// ==========================================================================
// FUNCIONES DE CONTROL (RECUPERADAS)
// ==========================================================================

function abrirEditarPropiedad(data) {
  // 1. Llenamos los campos del formulario con los datos de la propiedad
  document.getElementById('id-en-edicion').value = data.id;
  document.getElementById('prop-nombre').value = data.nombre;
  document.getElementById('prop-ubicacion').value = data.ubicacion;
  document.getElementById('prop-descripcion').value = data.descripcion;
  
  // Por si acaso el campo de mapa se llama diferente en tu BD
  const campoMapa = document.getElementById('prop-mapa');
  if (campoMapa) campoMapa.value = data.mapa_url || '';
  
  document.getElementById('prop-huespedes').value = data.huespedes;
  document.getElementById('prop-recamaras').value = data.recamaras;
  document.getElementById('prop-banos').value = data.banos;
  
  // 2. Limpiamos los inputs de archivos nuevos por si quedaron residuos
  if (typeof inputFotos !== 'undefined') inputFotos.value = '';
  if (typeof listaPrevia !== 'undefined') listaPrevia.innerHTML = '';

  // 3. Mostramos las imágenes actuales que ya tiene la propiedad (si existe la función)
  if (typeof mostrarImagenesParaEditar === 'function') {
    mostrarImagenesParaEditar(data.fotos || []);
  }
  
  // 4. Cambiamos el título del modal y lo hacemos visible
  if (typeof modalTitulo !== 'undefined') modalTitulo.textContent = "Editar Propiedad";
  if (typeof modalPropiedad !== 'undefined') modalPropiedad.classList.remove('hidden');
  
  console.log("🎯 Modal de edición abierto con los datos de:", data.nombre);
}

async function ejecutarBorradoPropiedad(id, nombre) {
  if (confirm(`¿Estás seguro de que deseas eliminar permanentemente "${nombre}"?`)) {
    try {
      const { error } = await supabase.from('propiedades').delete().eq('id', id);
      if (error) throw error;
      
      alert("Propiedad eliminada con éxito.");
      await cargarPropiedades(); // Recargamos la lista
    } catch (error) {
      console.error("Error al eliminar de Supabase:", error);
      alert("Hubo un error al intentar eliminar la propiedad.");
    }
  }
}