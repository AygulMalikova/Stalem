FROM node:10

WORKDIR /usr/src/app

# VOLUME [ "/usr/src/app" ]

ADD package.json .
ADD package-lock.json .

RUN rm -rf node_modules && npm install && rm -rf ~/tmp/*

ADD . .

# ENV NODE_ENV=production
ENV DATABASE=mongodb://mongodb:27017/stalem
ENV PORT=3000
# ENV PATH /usr/src/app/node_modules/.bin:$PATH

EXPOSE 3000

CMD node ./bin/www

