# Usar una imagen base de Node.js
FROM node:14

# Crear un directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto (asegúrate de que coincide con el que usa tu app)
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD [ "node", "app.js" ]
