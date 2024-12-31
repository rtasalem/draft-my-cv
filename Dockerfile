# Development
FROM node:23-alpine AS development
ENV NODE_ENV=development
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT} 9229
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
CMD [ "npm", "run", "start:watch" ]

# Production
FROM development AS production
ENV NODE_ENV=production
COPY --from=development /home/node/app/ ./app/
COPY --from=development /home/node/package*.json ./
RUN npm ci
CMD [ "node", "app" ]