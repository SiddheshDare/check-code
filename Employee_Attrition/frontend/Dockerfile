# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install ALL dependencies (including dev dependencies)
COPY package*.json ./
RUN npm ci

# Copy and build the app
COPY . .
ARG REACT_APP_API_URL=http://backend-service:8001
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Production stage
FROM nginx:alpine-slim

# Copy built files and nginx config
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set permissions (simplified)
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]