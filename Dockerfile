FROM node:8.15.0-alpine

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

ADD . .

RUN rm -rf node_modules && npm install --no-cache && rm -rf ~/tmp/*


ENV NODE_ENV=production
ENV DATABASE=mongodb://mongodb:27017/stalem
ENV PORT=3000

EXPOSE 3000

CMD npm start

