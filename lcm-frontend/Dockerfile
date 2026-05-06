# Build stage
FROM node:20 as build
ARG BUILD_CONFIGURATION=production

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=${BUILD_CONFIGURATION}

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist/lcm-frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]