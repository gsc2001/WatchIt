FROM node:16

# app dir
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]