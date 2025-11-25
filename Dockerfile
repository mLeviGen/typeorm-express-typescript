FROM node:16.14.0-alpine

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then \
      npm ci --no-fund --no-audit; \
    else \
      npm install --no-fund --no-audit; \
    fi && npm cache clean --force


COPY . .

RUN npm run build

EXPOSE 4000

CMD [ "npm", "start" ]