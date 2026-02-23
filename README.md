# Parte 1: Investigación Teórica – Arquitectura Técnica de una PWA

## Web App Manifest (`manifest.json`)

El **Web App Manifest** es un archivo JSON estándar que define metadatos de la aplicación web progresiva y permite que los navegadores reconozcan la aplicación como instalable y con una experiencia similar a la nativa. Este archivo debe ser referenciado en el HTML principal y es uno de los requisitos mínimos para que una app sea considerada PWA.

### `theme_color`

La propiedad `theme_color` en el manifiesto especifica el color principal de la interfaz de la aplicación. Este color puede influir en la presentación visual del navegador y del sistema cuando la aplicación se lanza desde la pantalla de inicio o se visualiza en modo standalone. Un valor adecuado mejora la integración visual con otros elementos del sistema y puede afectar la apariencia de barras de herramientas o áreas de UI del navegador cuando la PWA está activa.

### `background_color`

La propiedad `background_color` indica el color que se muestra mientras la aplicación se está cargando por primera vez, antes de que el contenido principal esté listo. Este ajuste es útil para evitar pantallas blancas o parpadeos que resultan poco profesionales y proporciona una transición más suave entre iniciar la aplicación y mostrar la interfaz de usuario.

### `display`

La propiedad `display` controla cómo se presenta la aplicación al usuario cuando se abre desde la pantalla principal o launcher. Los valores más relevantes son:
- `standalone`, que permite que la aplicación se muestre sin elementos de la interfaz del navegador, con una apariencia similar a una aplicación nativa.
- `fullscreen`, donde la aplicación ocupa toda la pantalla.
- `minimal-ui`, un modo intermedio con controles básicos.
- `browser`, que abre la aplicación como una pestaña normal del navegador.  
Estos modos permiten escoger cuánta interfaz del navegador se mantiene visible cuando la PWA se ejecuta para el usuario.

### `icons`

El array `icons` coloca referencias a imágenes de diferentes resoluciones y tamaños que deben usarse como íconos de la aplicación. Los navegadores utilizan estos íconos para representar la PWA en la pantalla de inicio, listas de aplicaciones o barras de tareas. Incluir múltiples tamaños asegura que la aplicación se vea bien en diferentes dispositivos y densidades de pantalla, además de ser un requisito para que el navegador considere la aplicación instalable.

---

## Service Workers

Un **Service Worker** es un script JavaScript que el navegador ejecuta en segundo plano, separado de la página web, lo que permite controlar las solicitudes de red y gestionar el almacenamiento en caché de recursos. Para funcionar, los Service Workers deben ser registrados desde el código de la aplicación y corren en un contexto seguro (HTTPS).

### Registro

El Service Worker se registra típicamente al cargar la aplicación. Este proceso asocia un script que el navegador puede instalar y activar, permitiendo a la PWA interceptar peticiones de red y gestionar la caché de manera programable. El registro es el primer paso para habilitar el comportamiento offline y de caché.

### Ciclo de Vida

Los Service Workers tienen un ciclo de vida propio, separado del de las páginas web:
- La fase de **install** es cuando el navegador descarga e instala el Service Worker y generalmente se aprovecha para precachear recursos esenciales.
- La fase de **activate** ocurre luego de la instalación, y suele usarse para limpiar versiones antiguas de cachés y tomar control de los clientes abiertos.
- La fase de **fetch** se ejecuta cada vez que se realiza una solicitud de red desde la aplicación, permitiendo responder desde la caché o la red según la lógica implementada.  
Este ciclo de vida permite planificar y controlar explícitamente qué recursos se almacenan y cómo se responde cuando el usuario está offline o con una red lenta.

### Intercepción de la Red

Los Service Workers actúan como un **proxy de red programable**, lo que significa que pueden interceptar todas las solicitudes de red realizadas por la aplicación. A partir de esa interceptación, el Service Worker puede decidir si responde con una versión almacenada en caché del recurso, si va a la red o si aplica alguna lógica híbrida que combine ambas fuentes. Esta capacidad es clave para proporcionar una experiencia de usuario que funcione offline o con conectividad intermitente.

---

## Estrategias de Almacenamiento (Caching)

Las **estrategias de caché** determinan cómo el Service Worker gestiona las respuestas a las solicitudes de recurso. Existen varias estrategias que se adaptan a diferentes necesidades de rendimiento y frescura de datos.

### Cache First

La estrategia **Cache First** intenta primero entregar el recurso desde la caché. Solo si el recurso no está almacenado se realiza una solicitud a la red y se guarda la respuesta en la caché para usos futuros. Esta estrategia es ideal para recursos estáticos como imágenes o archivos CSS/JS, donde la velocidad de entrega es crítica y el contenido cambia con poca frecuencia.

### Network First

La estrategia **Network First** prioriza la obtención de datos desde la red y, si la red falla, utiliza la versión disponible en caché como respaldo. Esto es útil para contenidos que deben estar lo más actualizados posible, como datos dinámicos provenientes de APIs, aunque puede implicar tiempos de respuesta más lentos si la conexión es inestable.

### Stale-While-Revalidate

La estrategia **Stale-While-Revalidate** devuelve primero la versión almacenada en caché de un recurso para proporcionar una respuesta rápida al usuario, mientras que en segundo plano realiza una solicitud de actualización al servidor. Cuando la respuesta de la red llega, actualiza la caché para futuras solicitudes. Esta estrategia equilibra velocidad y frescura de datos.

Comparativamente, la estrategia Cache First ofrece alto rendimiento con riesgo de servir contenido obsoleto, Network First asegura datos actualizados cuando la red está disponible, y Stale-While-Revalidate combina elementos de ambos para mejorar experiencia de usuario con actualizaciones periódicas.

---

## Seguridad y TLS

### HTTPS como Requisito

Uno de los requisitos técnicos fundamentales de una PWA es que sea servida mediante **HTTPS**. Los Service Workers sólo se pueden registrar en contextos seguros para proteger la integridad de las solicitudes interceptadas y evitar ataques de tipo “man-in-the-middle”. El uso de HTTPS garantiza la confidencialidad, integridad y autenticidad del servidor y es un prerrequisito para que las APIs modernas de web funcionen correctamente.

### Impacto de los Certificados SSL en el Prompt de Instalación

Los navegadores muestran el banner o prompt de instalación de una PWA solo cuando ciertos criterios se cumplen, y uno de los más importantes es que el sitio esté servido bajo HTTPS con un certificado válido. Sin una conexión segura, los Service Workers no serán registrados y el navegador no considerará la aplicación instalable. Esto significa que certificados SSL/TLS válidos son necesarios no solo para la seguridad de la conexión sino también para habilitar todas las capacidades instalables de una PWA.