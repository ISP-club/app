FROM node:14
MAINTAINER Cloud Solutions Center LLC <info@linkedrack.com> (https://linkedrack.com)
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g @quasar/cli
COPY . .
RUN quasar build
EXPOSE 80
CMD [ "quasar", "serve", "dist/spa", "-p", "80", "--history" ]
