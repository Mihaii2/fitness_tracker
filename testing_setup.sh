#!/bin/bash

# This setup has been created for a specific amazon linux version.
# For other linux distributions, the instructions may vary

sudo yum install docker

sudo yum install nginx


# Define Nginx directories
nginx_dir="/etc/nginx"
sites_available="$nginx_dir/sites-available"
sites_enabled="$nginx_dir/sites-enabled"
nginx_conf="$nginx_dir/nginx.conf"
project_conf_name="fitness_tracker_nginx.conf"
script_dir="$(dirname "$0")"
project_conf_path="$script_dir/$project_conf_name"

# Empty nginx.conf file
sudo truncate -s 0 "$nginx_conf"

# Create sites-available and sites-enabled directories if they don't exist
if [ ! -d "$sites_available" ]; then
    echo "Creating $sites_available"
    sudo mkdir "$sites_available"
else
    echo "$sites_available already exists"
fi

if [ ! -d "$sites_enabled" ]; then
    echo "Creating $sites_enabled"
    sudo mkdir "$sites_enabled"
else
    echo "$sites_enabled already exists"
fi

# Copy the project configuration file to sites-available if it doesn't exist
if [ ! -f "$sites_available/$project_conf_name" ]; then
    echo "Copying $project_conf_name to $sites_available"
    sudo cp "$project_conf_path" "$sites_available/$project_conf_name"
else
    echo "$project_conf_name already exists in $sites_available"
fi

# Create a symbolic link in sites-enabled if it doesn't exist
if [ ! -L "$sites_enabled/$project_conf_name" ]; then
    echo "Creating symbolic link for $project_conf_name in $sites_enabled"
    sudo ln -s "$sites_available/$project_conf_name" "$sites_enabled/$project_conf_name"
else
    echo "Symbolic link for $project_conf_name already exists in $sites_enabled"
fi

echo "Adding include directive for sites-enabled in nginx.conf"
sudo awk "BEGIN{print \"$include_directive\"}1" "$nginx_conf" > temp && sudo mv temp "$nginx_conf"


# Start nginx and docker if not running already
sudo nginx
sudo systemctl start docker

# Enable nginx and docker to run at startup
sudo systemctl enable docker
sudo systemctl enable nginx

# Reload Nginx to apply changes
echo "Reloading Nginx"
sudo nginx -t && sudo nginx -s reload