FROM node:latest  

#RUN apt-get update && apt-get install -y 
   
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY app/ .

RUN npm install 

EXPOSE 8080


CMD ["npm", "start"]