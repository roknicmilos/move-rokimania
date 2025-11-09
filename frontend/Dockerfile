FROM node:24

WORKDIR /app/src

COPY src/package*.json ./

RUN yarn install --frozen-lockfile

COPY src/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]
