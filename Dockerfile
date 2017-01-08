FROM node:7.4.0

RUN apt-get update \
	&& apt-get install -y \
		git \
	&& npm install -g aurelia-cli
	
COPY app /app
WORKDIR /app

CMD ["bash", "au", "run", "--watch"]