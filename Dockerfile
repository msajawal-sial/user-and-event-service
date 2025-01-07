FROM node:20.10.0-alpine
 
WORKDIR /user/src/app
 
COPY . .
 
RUN npm ci --omit=dev
 
RUN npm run build
 
USER node
 
CMD ["npm", "run", "start:prod"]