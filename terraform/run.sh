#!/bin/bash
sudo apt-get update
sudo apt-get install nginx
sudo service nginx start
sudo systemctl enable nginx
docker network create monitoring
docker run -d --name prometheus --network monitoring -p 9090:9090 prom/prometheus
docker run -d --name grafana --network monitoring -p 3000:3000 grafana/grafana
docker network inspect monitoring
docker logs prometheus
docker logs grafana