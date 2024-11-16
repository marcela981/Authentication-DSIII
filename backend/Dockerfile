FROM node:18-alpine


WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Copiar el script a la imagen
COPY wait-for-rabbitmq.sh /wait-for-rabbitmq.sh
RUN chmod +x /wait-for-rabbitmq.sh


# Define el comando de inicio que esperará a RabbitMQ antes de iniciar el servicio
CMD ["/wait-for-rabbitmq.sh", "rabbitmq:5672", "--", "npm", "start"]
