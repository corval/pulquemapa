# pulquemapa
Localizador de puntos de venta de Pulque
# El Ring Digital: Mapa Interactivo de Puntos de Venta  Luchador
![image](https://github.com/user-attachments/assets/c68cc27a-f972-4234-a433-01f532138b03)

![Licencia](https://img.shields.io/badge/licencia-MIT-blue)

> ¡Bienvenido a El Ring Digital! Un localizador de puntos de venta que abandona lo aburrido y se sube a la tercera cuerda para ofrecer una experiencia temática inolvidable inspirada en el espectacular mundo de la Lucha Libre mexicana.

Este proyecto transforma un mapa estándar en una "Cartelera de la Noche", donde cada tienda es un luchador con su propia máscara y cada usuario es el "Campeón" en busca de su próximo ring.


## ✨ Características Principales

Este mapa no es un simple localizador, ¡es todo un espectáculo!

* **🥊 Temática Inmersiva de Lucha Libre:** Cada elemento, desde los textos hasta los iconos, está diseñado para sumergirte en la arena.
* **🎭 Marcadores de Máscaras Personalizadas:** Cada punto de venta es un luchador único, representado por una de varias máscaras de luchador.
* **🏆 Marcador de Usuario "Campeón":** Tu ubicación se muestra con un glorioso cinturón de campeón.
* **📜 "Cartelera de la Noche" Interactiva:** Una lista de tiendas que funciona como una cartelera de luchas, sincronizada con el mapa.
* **🗺️ Geolocalización "Busca tu Ring":** Un botón que encuentra la ubicación del usuario y ordena la cartelera para mostrar los "retadores" más cercanos.
* **💥 Animaciones y Efectos Espectaculares:**
    * Los marcadores caen al mapa con una animación de entrada.
    * ¡Explosión de **confeti de victoria** al hacer clic en un luchador!
* **🔊 Efectos de Sonido de la Arena:**
    * **Campanazo de ring** al seleccionar un punto.
    * **Rugido del público** al buscar lugares cercanos.
    * Control para silenciar/activar el sonido para una mejor experiencia de usuario.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5**
* **CSS3** con Fuentes personalizadas de [Google Fonts](https://fonts.google.com/) (`Bangers` y `Oswald`).
* **JavaScript (ES6)**
* **[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)**
* **[Canvas-Confetti](https://github.com/catdad/canvas-confetti)** para el efecto de confeti.

---

## 🚀 Instalación y Puesta en Marcha

Para poner a luchar este proyecto en tu máquina local, sigue estos pasos:

1.  **Clona el Repositorio**
    ```bash
    git clone https://github.com/corval/pulquemapa.git
    ```

2.  **Obtén una Clave de API de Google Maps**
    Este proyecto **requiere** una clave de API de Google Maps para funcionar.
    * Ve a la [Consola de Google Cloud](https://console.cloud.google.com/).
    * Crea un nuevo proyecto y activa la **Maps JavaScript API**.
    * Genera una clave de API en la sección de "Credenciales".

3.  **Inserta tu Clave de API**
    Abre el archivo `index.html` y busca la siguiente línea al final del archivo. Reemplaza `TU_API_KEY` con la clave que generaste.
    ```html
    <script async src="[https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&callback=initMap](https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&callback=initMap)"></script>
    ```

4.  **Añade los Recursos Gráficos y de Sonido (Assets)**
    Este proyecto espera una estructura de carpetas específica. En la raíz de tu proyecto, crea una carpeta `assets` y dentro de ella, dos más: `images` y `sounds`.
    * **En `assets/images/` coloca tus imágenes:**
        * `mask_1.png`
        * `mask_2.png`
        * `mask_3.png`
        * `champion_belt.png`
    * **En `assets/sounds/` coloca tus sonidos:**
        * `bell_ring.mp3`
        * `crowd_roar.mp3`
    
    Puedes cambiar los nombres y la cantidad de archivos modificando las constantes al inicio del archivo `script.js`.

5.  **Abre el Ring**
    Simplemente abre el archivo `index.html` en tu navegador web. Para la mejor experiencia (especialmente con la geolocalización), se recomienda usar un servidor local como la extensión **Live Server** de Visual Studio Code.

---

## ⚙️ Configuración

Puedes personalizar fácilmente las máscaras, iconos y sonidos editando las constantes que se encuentran al principio del archivo `script.js`.

```javascript
// 🎨 PASO 1: CONFIGURACIÓN DE GRÁFICOS
const MASK_ICONS = [
  'assets/images/mask_1.png',
  // ...añade más máscaras aquí
];
const CHAMPION_BELT_ICON = 'assets/images/champion_belt.png';

// 🔊 PASO 2: CONFIGURACIÓN DE SONIDOS
const SOUNDS = {
    bell: 'assets/sounds/bell_ring.mp3',
    crowd: 'assets/sounds/crowd_roar.mp3',
};
