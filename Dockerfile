FROM node:9-alpine
WORKDIR /app
EXPOSE 4455

COPY dist /app/dist
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
ENV NODE_ENV production
RUN npm install
CMD ["npm", "run", "start"]
