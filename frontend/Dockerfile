FROM node:24

COPY entrypoint.sh      /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

WORKDIR /app/src
COPY src/ .

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
