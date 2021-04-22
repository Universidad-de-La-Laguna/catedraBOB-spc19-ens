FROM node:carbon-alpine

ENV NODE_ENV production

RUN apk update && apk upgrade && \
    apk add --no-cache git

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Install node global dependencies
RUN npm install -g pino-pretty

# VOLUME ["/usr/src/app/contract/contractABI.json"]

CMD [ "npm", "start" ]
