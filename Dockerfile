# Utiliza la imagen de Node.js 18 con Debian Buster como base
FROM node:18-buster

# Instala git y dependencias globales
RUN apt-get update && apt-get install -y git && \
    npm install -g nodemon @angular/cli

# Crea un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el backend al contenedor
COPY Backend-LostFound-main/backend /usr/src/app/backend

# Instala las dependencias del backend
WORKDIR /usr/src/app/backend
RUN npm install

# Rebuild de las dependencias nativas
RUN npm rebuild bcrypt --build-from-source

# Copia el frontend al contenedor
COPY Frontend_Lostfound /usr/src/app/frontend

# Instala las dependencias del frontend
WORKDIR /usr/src/app/frontend
RUN npm install

# Establece las variables de entorno directamente en el Dockerfile
ENV PORT=3001
ENV HOST=localhost
ENV DB_URL=mongodb+srv://estebancarril14:d3vJrE1p2BeObyNV@clusterlostfound.5xj0omy.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLostFound
ENV JWT_SECRET=secret

# Expon el puerto 3001 para el backend y el puerto 4200 para el frontend
EXPOSE 3001
EXPOSE 4200

# Comando para iniciar el backend y el frontend
CMD ["sh", "-c", "cd /usr/src/app/backend && nodemon src/server.js & cd /usr/src/app/frontend && ng serve --host 0.0.0.0 --port 4200"]
