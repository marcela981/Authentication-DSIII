#!/bin/sh

HOST="$1"
PORT="$2"
shift 2

echo "Esperando a que RabbitMQ esté disponible en $HOST:$PORT..."

# Reintenta hasta que RabbitMQ esté accesible en el puerto especificado
until nc -z -v -w30 $HOST $PORT
do
  echo "RabbitMQ no está disponible todavía - reintentando..."
  sleep 5
done

echo "RabbitMQ está arriba - ejecutando comando"

# Ejecuta el comando proporcionado
exec "$@"
