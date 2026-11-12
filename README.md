# Quesudos Moncho - Página Web

Página web profesional para **Quesudos Moncho**, un negocio de comidas rápidas ubicado en Bello, Antioquia, Colombia.

## Descripción

Sitio web responsivo que presenta el catálogo de productos y precios, galería y ubicación. Los clientes pueden armar un carrito, ajustar cantidades y enviar el resumen del pedido por WhatsApp para confirmar disponibilidad, domicilio y medios de pago.

## Estructura del proyecto

```text
index.html        Página principal
css/styles.css    Estilos del sitio
js/data.js        Datos del negocio, menú y productos
js/main.js        Interacciones del sitio
img/              Imágenes proporcionadas por el negocio
```

El carrito funciona en la sesión actual del navegador. Antes de enviar el pedido por WhatsApp, el cliente ingresa su nombre, teléfono, modalidad de entrega, dirección cuando solicita domicilio, forma de pago y notas opcionales. La transferencia, la cobertura y el costo del domicilio se confirman directamente con el negocio. El sitio no procesa pagos ni registra pedidos en un servidor.

## Imágenes

La portada, la sección Nosotros y la galería usan la foto real `Haburguesa.jpg`. El encabezado y el pie de página usan la mascota del archivo `Logo-marca.jpg`. Las demás fotos del catálogo y la galería son ilustrativas de Unsplash y pueden reemplazarse en `js/data.js` por fotografías reales de esos productos cuando estén disponibles. `Menu.jpg` se utilizó como referencia para verificar los nombres y precios del catálogo.

## Tecnologías

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid, animaciones)
- JavaScript
- Google Fonts (Poppins, Bebas Neue)
- Diseño responsive

## Contacto

- WhatsApp: 313 541 3017
- Horario informado: 5:00 p. m. a 11:00 p. m.
- Instagram: [@quesudos.moncho](https://www.instagram.com/quesudos.moncho/)
- Dirección: Diagonal 65 #40-05, Bello, Antioquia

## Modificar productos y precios

Los productos, precios e información del negocio están en `js/data.js` para facilitar futuras modificaciones sin tocar la interfaz.
