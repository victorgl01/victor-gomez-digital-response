* Haría la persistencia de datos, pero no entiendo muy bien realmente qué se quiere persistir
* En caso de ser un proyecto que saliese a producción habria que añadir capas de seguridad, como mínimo CORS y JWT para evitar uso fraudulento de gente externa
* Entiendo que la unica validacion de fecha es el formato, no incluye que sea antes o despues de x fecha
* Los ficheros se manda por HTTP por que son ficheros pequeños. En caso de tener que procesar ficheros grandes, se usaria un proveedor externo para recoger los ficheros.