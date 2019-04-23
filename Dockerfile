FROM node:6.17.1 as app

WORKDIR /app

#wildcard as some files may not be in all repos
COPY package*.json npm-shrink*.json /app/

RUN npm install --quiet

COPY . /app


RUN npm run compile:all

FROM node:6.17.1

WORKDIR /app

CMD ["node", "--expose-gc", "app.js"]

COPY --from=app /app/install_deps.sh /app
RUN sh ./install_deps.sh

COPY --from=app /app /app

RUN sh ./setup_env.sh

USER node
