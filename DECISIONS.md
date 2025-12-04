### ¿Cómo escalarías si fueran 100k filas?
Para el backend, utilizaría un proveedor externo para almacenar los ficheros de forma temporal y poder rescatarlos des de el backend des de ahí. En casos extremos, se podría ejecutar el servicio de validación de forma asíncrona y al acabar enviar un mail al usuario con los resultados.
### ¿Qué límites pondrías para evitar sobrecarga?
Lo primero de todo sería añadir Rate Limiting en la API. Evitaríamos que un mismo usuario enviase varios ficheros seguidos al backend. A nivel de frontend, hasta no recibir el resultado el boton no debería ser clickable.
### ¿Usarías colas para envío masivo de emails?
Entendiendo colas como una lista de jobs (en este caso serian todos envios de mails) que se deben ejecutar asíncronamente, sí es muy recomendable para no sobrecargar el servidor. Los mails que no se puedan enviar se quedan en la cola hasta que el servidor tenga la capacidad para poder enviarlos.
### ¿Ventajas de Docker?
Poder emular el entorno de produccion en local (o cualquier entorno). En todos los entornos tienes las mismas dependencias. Eliminas el típico "pues en mi ordenador si funciona". Permite hacer releases de forma mucho mas rápida ya que solo tienes que hacer build de tu nuevo desarrollo y en el entorno de produccion bajarte la nueva imagen.
### ¿Qué métricas/logs implementarías?
Pudiendo añadir una nueva app, utilizaría Grafana (open-source) para poder trackear todo el rendimiento del servidor, a qué horas se utiliza más el servidor, cuanto tarda de media en responder la API, cual es la media de peso de los ficheros que nos envian, cuánto se usa cada endpoint.