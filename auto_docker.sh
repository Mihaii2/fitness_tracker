#!/bin/bash

####

# Automatically deletes and re-creates Docker image and container

####

# Define container and image names
CONTAINER_NAME="mihai/fitness-tracker"
IMAGE_NAME="mihai/fitness-tracker"

# Get the container ID by name
CONTAINER_ID=$(docker ps -a -q --filter ancestor=$CONTAINER_NAME)

echo stopping.. $CONTAINER_ID
# Stop the existing container if it is running
if [ -n "$CONTAINER_ID" ]; then
  docker stop $CONTAINER_ID
  echo $CONTAINER_ID stopped
fi

echo removing... $CONTAINER_ID
# Remove the existing container by ID
if [ -n "$CONTAINER_ID" ]; then
  docker rm $CONTAINER_ID
  echo $CONTAINER_NAME REMOVED
fi
echo removing... $IMAGE_NAME
# Remove the existing image
if docker images | grep -q $IMAGE_NAME; then
  docker rmi $IMAGE_NAME
  echo $IMAGE_NAME stopped
fi


# Pull the latest version of the image from the registry
docker build -t mihai/fitness-tracker .

# Run a new container with the updated image
docker run -d --restart always -p 4000:4000 -d mihai/fitness-tracker

# Optional: Display container and image information
docker ps -a | grep $CONTAINER_NAME
docker images | grep $IMAGE_NAME
