/**
 * whatsapp.js
 * Función reutilizable que construye el mensaje de WhatsApp con el
 * formato exacto solicitado y redirige al usuario a la API wa.me.
 *
 * IMPORTANTE: sustituye NUMERO_WHATSAPP por el número real,
 * en formato internacional y sin signos, espacios ni "+".
 * Ejemplo: para +52 314 123 4567 -> "523141234567"
 */

const NUMERO_WHATSAPP = "5213141036271"; // <-- reemplazar con el número real

/**
 * Formatea una fecha en formato YYYY-MM-DD (valor nativo de <input type="date">)
 * a un formato legible en español, ej: "12 de agosto de 2026".
 */
function formatearFechaLegible(fechaISO) {
  if (!fechaISO) return "";
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const opciones = { day: "numeric", month: "long", year: "numeric" };
  return fecha.toLocaleDateString("es-MX", opciones);
}

/**
 * Construye el mensaje con el formato exacto pedido y abre WhatsApp
 * con el texto ya codificado para URL.
 *
 * @param {Object} datos
 * @param {string} datos.nombreDepartamento
 * @param {string} datos.checkIn   Fecha en formato YYYY-MM-DD
 * @param {string} datos.checkOut  Fecha en formato YYYY-MM-DD
 * @param {number|string} datos.huespedes
 */
function redirigirAWhatsapp(datos) {
  const { nombreDepartamento, checkIn, checkOut, huespedes } = datos;

  const checkInLegible = formatearFechaLegible(checkIn);
  const checkOutLegible = formatearFechaLegible(checkOut);

  const mensaje =
    `Hola me interesa el departamento ${nombreDepartamento} ` +
    `para la fecha ${checkInLegible} y la fecha de salida ${checkOutLegible}, ` +
    `y somos ${huespedes} huéspedes. ¿Me podría brindar más información?`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;

  window.open(url, "_blank");
}
