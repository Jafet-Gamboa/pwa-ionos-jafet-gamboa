# ---------- ETAPA 1: BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- ETAPA 2: PRODUCCIÓN ----------
FROM nginx:stable-alpine

# Eliminar config default
RUN rm -rf /usr/share/nginx/html/*

# Copiar build generado por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]