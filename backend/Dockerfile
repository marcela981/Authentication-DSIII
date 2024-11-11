FROM node:18-alpine


WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Copia el script de espera
COPY wait-for-rabbitmq.sh /wait-for-rabbitmq.sh

# Asegúrate de que el script tenga permisos de ejecución
RUN chmod +x /wait-for-rabbitmq.sh

# Define el comando de inicio que esperará a RabbitMQ antes de iniciar el servicio
CMD ["/wait-for-rabbitmq.sh", "rabbitmq:5672", "--", "npm", "start"]
