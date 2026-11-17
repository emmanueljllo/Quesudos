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

El carrito y los datos del cliente se guardan en `localStorage` en el dispositivo. Antes de enviar el pedido por WhatsApp, el cliente ingresa su nombre, teléfono, modalidad de entrega, dirección cuando solicita domicilio, forma de pago y notas opcionales. El mensaje incluye un número de pedido, productos y adiciones, total y, si el cliente lo autoriza, un enlace de ubicación. La transferencia, la cobertura y el costo del domicilio se confirman directamente con el negocio. El sitio no procesa pagos ni registra pedidos en un servidor.

Al preparar el pedido se muestra un recibo con el mismo número identificador del mensaje de WhatsApp. Se puede imprimir o guardar como PDF desde el botón del recibo. El subtotal no incluye el domicilio, cuyo costo se confirma por WhatsApp. El recibo indica que el pedido está pendiente de confirmación; no es factura ni confirma el pago.

El carrito ofrece sugerencias para hamburguesas, adiciones con precio y una barra de progreso para el beneficio de domicilio gratis. El umbral inicial es `$40.000` y se configura en `MENU_SETTINGS.freeDeliveryThreshold` en `js/data.js`; confirma y ajusta ese valor a la política real del negocio. El beneficio se anuncia sujeto a cobertura.

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

## Menú editable con Google Sheets

1. Crea una hoja con una fila de encabezados y publícala en la web como CSV.
2. Usa estas columnas: `category_id`, `category`, `name`, `price`, `image`, `description`, `available`, `suggested`, `free_delivery_threshold`.
3. En `available`, usa `TRUE` para disponible o `FALSE` para mostrar el producto como agotado. En `suggested`, escribe los nombres exactos de los productos sugeridos separados por `|`.
4. Copia la URL CSV publicada en `MENU_SETTINGS.feedUrl` en `js/data.js` (configuración inicial única). La página consulta el menú al cargar; si el feed no está disponible o tiene datos inválidos, mantiene el menú local y muestra un aviso.

Usa los identificadores de categoría existentes (`hamburguesas`, `perros`, `perras`, `otras-delicias`, `adiciones`) para conservar sus iconos y filtros. El umbral de domicilio gratis puede ir en `free_delivery_threshold` (valor numérico en COP; se toma el primer valor no vacío) o mantenerse en `MENU_SETTINGS`. Mantén en `js/data.js` las sugerencias y precios de adiciones.

## Modificar productos y precios

Sin feed publicado, los productos, precios, sugerencias y precios de adiciones están en `js/data.js`. Allí se configuran también el umbral inicial y el precio del huevo adicional. El último pedido y los datos de contacto permanecen en el almacenamiento local del navegador; no se envían a un servidor del sitio. La ubicación se solicita al usuario y solo se incorpora al mensaje de WhatsApp cuando la comparte.
