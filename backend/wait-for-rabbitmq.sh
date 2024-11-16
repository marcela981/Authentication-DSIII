#!/bin/bash

set -e

# Variables de entorno predeterminadas
RABBITMQ_HOST="${RABBITMQ_HOST:-localhost}"
RABBITMQ_PORT="${RABBITMQ_PORT:-5672}"

echo "Esperando a RabbitMQ en $RABBITMQ_HOST:$RABBITMQ_PORT..."
until nc -z "$RABBITMQ_HOST" "$RABBITMQ_PORT"; do
  echo "RabbitMQ no está disponible todavía - reintentando..."
  sleep 1
done

echo "RabbitMQ está listo, arrancando el servicio..."
exec "$@"
