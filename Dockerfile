FROM node:12.18.1 as development
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN rm -r ./node_modules && npm install --only=production


FROM node:12.18.1-alpine3.11 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./confd ./confd
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist ./dist
CMD ["npm","run","confd:prod","&&","node", "dist/main"]

