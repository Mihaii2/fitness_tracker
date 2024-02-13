#!/bin/bash

####

# Automatically deletes and re-creates Docker image and container

####

# Define container and image names
CONTAINER_NAME="mihai/fitness-tracker"
IMAGE_NAME="mihai/fitness-tracker"

# Get the container ID by name
CONTAINER_ID=$(docker ps -a -q --filter name=$CONTAINER_NAME)

# Stop the existing container if it is running
if [ -n "$CONTAINER_ID" ]; then
  docker stop $CONTAINER_ID
fi

# Remove the existing container by ID
if [ -n "$CONTAINER_ID" ]; then
  docker rm $CONTAINER_ID
fi

# Remove the existing image
if docker images | grep -q $IMAGE_NAME; then
  docker rmi $IMAGE_NAME
fi

# Pull the latest version of the image from the registry
docker build -t mihai/fitness-tracker .

# Run a new container with the updated image
docker run -d --restart always -d mihai/fitness-tracker

# Optional: Display container and image information
docker ps -a | grep $CONTAINER_NAME
docker images | grep $IMAGE_NAME
