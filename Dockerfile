# Usa Python como base
FROM python:3.9

# Crear directorio de trabajo
WORKDIR /app

# Copiar requerimientos e instalarlos
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código, incluyendo .env
COPY . /app

# Exponer el puerto
EXPOSE 8001

# Comando para lanzar
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
