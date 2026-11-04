/**
 * ============================================
 * QUESUDOS MONCHO - Datos del Menu
 * ============================================
 * Archivo separado para facilitar futuras
 * modificaciones de productos y precios.
 * ============================================
 */

var BUSINESS_INFO = {
  name: "Quesudos Moncho",
  slogan: "Los mejores sabores de las comidas rapidas en Bello",
  address: "Avenida 47B #61-171, Bello, Antioquia",
  city: "Bello, Antioquia, Colombia",
  whatsapp: "324 296 9587",
  whatsappLink: "https://wa.link/5mk8oe",
  instagram: "@quesudos.moncho",
  instagramLink: "https://www.instagram.com/quesudos.moncho/",
  mapsQuery: "Avenida+47B+%2361-171,+Bello,+Antioquia,+Colombia",
};

var MENU_DATA = [
  {
    id: "hamburguesas",
    category: "Hamburguesas",
    icon: "\u{1F354}",
    description: "Todas traen ensalada, ripio, cebolla y salsas al gusto.",
    items: [
      {
        name: "Hamburguesa sencilla",
        price: 12000,
        image: "img/Haburguesa.jpg",
        description: "Ensalada, ripio, cebolla y salsas al gusto",
      },
      {
        name: "Hamburguesa especial (queso y tocineta)",
        price: 16000,
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=400&fit=crop",
        description: "Ensalada, ripio, cebolla y salsas al gusto",
      },
      {
        name: "Hamburguesa súper (doble todo)",
        price: 19500,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=400&fit=crop",
        description: "Ensalada, ripio, cebolla y salsas al gusto",
      },
    ],
  },
  {
    id: "perros",
    category: "Perros",
    icon: "\u{1F32D}",
    description: "Todos traen salchicha, queso, ensalada, ripio, cebolla y salsas al gusto.",
    items: [
      {
        name: "Pequeño solo queso",
        price: 12000,
        image: "https://images.unsplash.com/photo-1638368593249-7cadb261e8b3?w=500&h=400&fit=crop",
        description: "Salchicha, queso, ensalada, ripio, cebolla y salsas al gusto",
      },
      {
        name: "Pequeño con tocineta",
        price: 13000,
        image: "https://images.unsplash.com/photo-1776260486226-11dabfacf5f2?w=500&h=400&fit=crop",
        description: "Salchicha, queso, ensalada, ripio, cebolla y salsas al gusto",
      },
      {
        name: "Grande solo queso",
        price: 13500,
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&h=400&fit=crop",
        description: "Salchicha, queso, ensalada, ripio, cebolla y salsas al gusto",
      },
      {
        name: "Grande con tocineta",
        price: 14500,
        image: "https://images.unsplash.com/photo-1638368593249-7cadb261e8b3?w=500&h=400&fit=crop",
        description: "Salchicha, queso, ensalada, ripio, cebolla y salsas al gusto",
      },
    ],
  },
  {
    id: "perras",
    category: "Perras",
    icon: "\u{1F32D}",
    description: "Todas traen tocineta, queso, ensalada, ripio, cebolla y salsas al gusto.",
    items: [
      {
        name: "Perra grande",
        price: 16500,
        image: "https://images.unsplash.com/photo-1776260486226-11dabfacf5f2?w=500&h=400&fit=crop",
        description: "Con tocineta, queso, ensalada, ripio, cebolla y salsas al gusto",
      },
      {
        name: "Perra pequeña",
        price: 14000,
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&h=400&fit=crop",
        description: "Con tocineta, queso, ensalada, ripio, cebolla y salsas al gusto",
      },
    ],
  },
  {
    id: "otras-delicias",
    category: "Otras Delicias",
    icon: "\u{1F35F}",
    description: "",
    items: [
      {
        name: "Salchipapas",
        price: 10500,
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&h=400&fit=crop",
        description: "",
      },
      {
        name: "Salchipapas especial (con queso y tocineta)",
        price: 18000,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop",
        description: "",
      },
      {
        name: "Chuzo de pollo",
        price: 19500,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop",
        description: "",
      },
      {
        name: "Chuzo de cerdo",
        price: 19500,
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&h=400&fit=crop",
        description: "",
      },
    ],
  },
  {
    id: "adiciones",
    category: "Adiciones",
    icon: "\u2795",
    description: "",
    items: [
      {
        name: "Papas",
        price: 5000,
        image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=500&h=400&fit=crop",
        description: "",
      },
      {
        name: "Carne",
        price: 4000,
        image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&h=400&fit=crop",
        description: "",
      },
      {
        name: "Queso",
        price: 4500,
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=400&fit=crop",
        description: "",
      },
      {
        name: "Tocineta",
        price: 3000,
        image: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=500&h=400&fit=crop",
        description: "",
      },
    ],
  },
];

var GALLERY_IMAGES = [
  {
    src: "img/Haburguesa.jpg",
    alt: "Hamburguesa con queso fundido",
  },
  {
    src: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=500&fit=crop",
    alt: "Hamburguesa con tocineta",
  },
  {
    src: "https://images.unsplash.com/photo-1638368593249-7cadb261e8b3?w=600&h=500&fit=crop",
    alt: "Perro caliente con queso",
  },
  {
    src: "https://images.unsplash.com/photo-1776260486226-11dabfacf5f2?w=600&h=500&fit=crop",
    alt: "Perra con tocineta y queso",
  },
  {
    src: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=500&fit=crop",
    alt: "Salchipapas con salsas",
  },
  {
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=500&fit=crop",
    alt: "Chuzos a la parrilla",
  },
];

/**
 * Formatea un precio en pesos colombianos
 */
function formatPrice(price) {
  return "$" + price.toLocaleString("es-CO");
}
