

# Utiliser l'image officielle de Node.js comme base
FROM node:18

# installer le gestionnaire de package
RUN npm i -g pnpm

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY package*.json ./
COPY vite.config.js ./

# Installer les dépendances
RUN pnpm install

# Copier les fichiers du projet
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application avec Vite
CMD ["npm", "run", "dev"]