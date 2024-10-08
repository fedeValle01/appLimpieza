# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /

# Copia el archivo package.json y el archivo package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el código fuente del proyecto al contenedor
COPY . .

# Expone el puerto que Expo usa por defecto
EXPOSE 19000

# Comando para iniciar la aplicación
CMD ["npx", "expo", "start", "--tunnel"]
