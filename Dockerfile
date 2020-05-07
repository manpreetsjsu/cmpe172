FROM node:12.16.3
# container .

WORKDIR /app

COPY . /app

RUN npm install

CMD npm start

EXPOSE 3000