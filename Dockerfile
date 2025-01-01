ARG PORT=3000

# Development
FROM node:23-alpine AS development
WORKDIR /home/node/
USER node
ENV NODE_ENV=development
ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node ./app ./app
CMD [ "npm", "run", "start:watch" ]

# Production
FROM development AS production
ENV NODE_ENV=production
RUN npm ci
CMD [ "node", "app" ]