FROM node:16

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json .
RUN npm install --save-dev
COPY . .

CMD ["PORT=3000", "npm", "run" ,"react"]
