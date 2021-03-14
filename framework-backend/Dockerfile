FROM openjdk:8

RUN apt-get update

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash

RUN apt-get install -y \
  nodejs \
  vim \ 
  python3 \ 
  python3-pip \ 
  git

WORKDIR /
RUN git clone https://github.com/ljkirby/wem-server.git wem-server

WORKDIR /wem-server/src
RUN npm install
EXPOSE 8080

ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN git pull

ENV CLASSPATH=/wem-server/libraries/Bunch.jar
CMD ["npm", "start"]
