FROM nginx:1.27-alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8088
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8088/ || exit 1
