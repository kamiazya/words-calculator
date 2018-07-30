#!/bin/bash

# nginx-ingress があるかどうか
helm ls --all nginx-ingress -q | grep nginx-ingress > /dev/null

if [ $? = 1 ]; then \
  helm install stable/nginx-ingress --name nginx-ingress --namespace ingress; \
fi
