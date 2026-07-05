/**
 * data.js
 * Fuente única de datos del catálogo.
 */

const PROPIEDADES = [
  {
    id: "villas-la-ribera",
    nombre: "Hermoso Departamento Planta Media",
    ubicacion: "Manzanillo, Colima",
    mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5300092586585!2d-104.34981839999999!3d19.1282636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8424d700457e055d%3A0x8549875861401ff1!2sVillas%20la%20Ribera%203!5e0!3m2!1ses-419!2smx!4v1783133952293!5m2!1ses-419!2smx",
    huespedesMax: 6,
    recamaras: 3,
    banos: 2,
    resumen: "Villa Con Alberca a 5 min de la playa",
    descripcion: "El condominio exclusivo Villas La Ribera 3 cuenta con una amplia alberca, camastros y regadera de la cual podrás disfrutar. Las mejores playas se encuentran a tan solo 7 minutos! tales como La boquita, La audiencia, Olas altas entre otras. Rutas de camiones afuera del coto, comercios, tiendas etc. El departamento es nuevo, está muy amplio y cuenta con todo lo necesario para tu comodidad, televisión, Wifi, aire acondicionado, ventiladores y más. ¡Ofertas especiales todo el año! ¡Visítanos!",
    amenidades: [
      "Cocina",
      "Wifi",
      "Área para trabajar",
      "Estacionamiento gratuito en las instalaciones",
      "Alberca compartida",
      "Televisión",
      "Lavadora",
      "Cámaras de seguridad exteriores en la propiedad"
    ],
    galeria: [
      { src: "Memo/Alberca1.png", alt: "Alberca, vista 1", categoria: "Alberca" },
      { src: "Memo/Alberca2.png", alt: "Alberca, vista 2", categoria: "Alberca" },
      { src: "Memo/Alberca3.png", alt: "Alberca, vista 3", categoria: "Alberca" },
      { src: "Memo/Sala.png", alt: "Sala", categoria: "Sala" },
      { src: "Memo/Cocina.png", alt: "Cocina, vista 1", categoria: "Cocina" },
      { src: "Memo/Cocina2.png", alt: "Cocina, vista 2", categoria: "Cocina" },
      { src: "Memo/Comedor.png", alt: "Comedor, vista 1", categoria: "Comedor" },
      { src: "Memo/Comedor2.png", alt: "Comedor, vista 2", categoria: "Comedor" },
      { src: "Memo/Comedor3.png", alt: "Comedor, vista 3", categoria: "Comedor" },
      { src: "Memo/Recamara1.png", alt: "Recámara 1", categoria: "Recámara 1" },
      { src: "Memo/Recamara1.2.png", alt: "Recámara 1, vista 2", categoria: "Recámara 1" },
      { src: "Memo/Recamara2.png", alt: "Recámara 2", categoria: "Recámaras 2" },
      { src: "Memo/Recamara3.png", alt: "Recámara 3", categoria: "Recámara 3" },
      { src: "Memo/Bano1.png", alt: "Baño 1", categoria: "Baños" },
      { src: "Memo/Bano2.png", alt: "Baño 2", categoria: "Baños" },
      { src: "Memo/Exterior.png", alt: "Exterior de Villas La Ribera", categoria: "Exterior" }
    ]
  },
  {
    id: "villa-colibri",
    nombre: "Villa Colibrí Depto. en PB con alberca privada",
    ubicacion: "Manzanillo, Colima ",
     mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5300092586585!2d-104.34981839999999!3d19.1282636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8424d700457e055d%3A0x8549875861401ff1!2sVillas%20la%20Ribera%203!5e0!3m2!1ses-419!2smx!4v1783133952293!5m2!1ses-419!2smx",
    huespedesMax: 8,
    recamaras: 3,
    banos: 2,
    resumen: "Villa amplia con alberca privada.",
    descripcion: "Ubicado en el condominio privado Villas la Ribera 3, este departamento en planta baja está equipado con todo lo necesario para una estancia agradable y acabados de lujo. Cuenta con alberca en el complejo y una alberca privada al interior del departamento. Se encuentra a solo 3 minutos del Blvd. Miguel de la Madrid y a 6 minutos (1.8 km) de la playa más cercana. El edificio es moderno, terminado en 2020-2021. Los huéspedes tienen acceso total al departamento y áreas comunes. Ubicado en el barrio de Santiago, con tiendas y farmacias en la misma calle. Playas cercanas: Olas Altas, Santiago y Miramar. Capacidad máxima: 8 personas (incluyendo menores).",
    amenidades: [
  // Cocina y Comedor
  "Cocina equipada", "Refrigerador", "Microondas", "Estufa de gas", "Cafetera", "Licuadora", "Utensilios básicos",
  
  // Entretenimiento y Conectividad
  "Wifi", "Televisión con Netflix", "Juegos de mesa",
  
  // Confort y Lavandería
  "Lavadora", "Plancha", "Aire acondicionado", "Ventiladores", "Ropa de cama y toallas",
  
  // Exterior y Playa
  "Alberca privada", "Alberca compartida (horario 10am-10:30pm)", "Patio privado", "Jardín con valla", "Muebles exteriores", "Básicos para playa (equipo de snorkel, sombrilla)",
  
  // Seguridad y Extras
  "Estacionamiento techado", "Cámaras de seguridad exteriores", "Detectores de humo y monóxido", "Botiquín", "Entrada privada"
],
  galeria: [
  // Alberca y Exterior
  { src: "Sandra/patioext.png", alt: "Patio exterior", categoria: "Patio Exterior" },
  { src: "Sandra/albercapriv.png", alt: "Alberca privada", categoria: "Alberca Privada" },
  { src: "Sandra/alberca.png", alt: "Alberca compartida", categoria: "Alberca Condominio" },

  { src: "Sandra/patio.png", alt: "Patio privado", categoria: "Patio Trasero" },
  { src: "Sandra/patioext.png", alt: "Patio exterior", categoria: "Patio Exterior" },
  { src: "Sandra/exterior2.png", alt: "Patio exterior", categoria: "Patio Exterior" },
  { src: "Sandra/exterior3.png", alt: "Patio exterior", categoria: "Patio Exterior" },
  { src: "Sandra/garage.png", alt: "Estacionamiento techado", categoria: "Garage" },

   { src: "Sandra/exterior.png", alt: "Vista exterior", categoria: "Exterior Villas" },

  // Interiores: Sala, Cocina y Comedor
  { src: "Sandra/Sala.png", alt: "Sala de estar", categoria: "Sala" },
  { src: "Sandra/Cocina.png", alt: "Cocina equipada", categoria: "Cocina" },
  { src: "Sandra/comedor.png", alt: "Comedor", categoria: "Comedor" },

  // Recámaras
  { src: "Sandra/recamara1.png", alt: "Recámara 1", categoria: "Recámara 1" },
  { src: "Sandra/recamara2.png", alt: "Recámara 2", categoria: "Recámara 2" },
  { src: "Sandra/recamara3.png", alt: "Recámara 3", categoria: "Recámara 3" },

  // Baños
  { src: "Sandra/bano1.png", alt: "Baño 1", categoria: "Baños" },
  { src: "Sandra/bano2.png", alt: "Baño 2", categoria: "Baños" }
]
  },
  {
    id: "refugio-dunas",
    nombre: "Refugio Dunas",
    ubicacion: "Zona tranquila, cerca de manglares",
    huespedesMax: 4,
    recamaras: 2,
    banos: 1,
    resumen: "Casa pequeña y acogedora rodeada de vegetación, ideal para desconectar.",
    descripcion: "Pensada para estancias tranquilas, Refugio Dunas está rodeada de vegetación nativa.",
    amenidades: ["Wifi", "Hamacas exteriores", "Cocina equipada", "Estacionamiento", "Ventilador de techo"],
    galeria: [
      { src: "https://picsum.photos/id/1039/900/650", alt: "Foto de la propiedad", categoria: "General" }
    ]
  },
  {
    id: "departamento-bahia",
    nombre: "Departamento Bahía",
    ubicacion: "Torre frente al malecón",
    huespedesMax: 4,
    recamaras: 2,
    banos: 2,
    resumen: "Departamento moderno en piso alto con vista abierta al malecón.",
    descripcion: "Ubicado en un piso alto, este departamento ofrece vista abierta al malecón y a la bahía.",
    amenidades: ["Wifi", "Alberca común", "Gimnasio", "Estacionamiento", "Aire acondicionado", "Elevador"],
    galeria: [
      { src: "https://picsum.photos/id/1048/900/650", alt: "Foto de la propiedad", categoria: "General" }
    ]
  },
  {
    id: "casa-los-pinos",
    nombre: "Casa Los Pinos",
    ubicacion: "Zona alta, entre árboles",
    huespedesMax: 7,
    recamaras: 3,
    banos: 2,
    resumen: "Casa entre árboles con alberca al aire libre y amplio jardín.",
    descripcion: "Casa Los Pinos está rodeada de árboles altos que dan sombra natural a la alberca.",
    amenidades: ["Wifi", "Alberca privada", "Jardín amplio", "Asador", "Estacionamiento"],
    galeria: [
      { src: "https://picsum.photos/id/1054/900/650", alt: "Foto de la propiedad", categoria: "General" }
    ]
  },
  {
    id: "estudio-arena",
    nombre: "Estudio Arena",
    ubicacion: "A dos calles de la playa",
    huespedesMax: 2,
    recamaras: 1,
    banos: 1,
    resumen: "Estudio compacto y luminoso, ideal para parejas o viajeros solos.",
    descripcion: "Estudio Arena es la opción más compacta del catálogo.",
    amenidades: ["Wifi", "Cocina equipada", "Aire acondicionado", "Ropa de cama incluida"],
    galeria: [
      { src: "https://picsum.photos/id/1062/900/650", alt: "Foto de la propiedad", categoria: "General" }
    ]
  }
];

function obtenerPropiedadPorId(id) {
  return PROPIEDADES.find((propiedad) => propiedad.id === id);
}