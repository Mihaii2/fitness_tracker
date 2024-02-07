#!/bin/bash

# Define Nginx directories
nginx_dir="/etc/nginx"
sites_available="$nginx_dir/sites-available"
sites_enabled="$nginx_dir/sites-enabled"
nginx_conf="$nginx_dir/nginx.conf"
project_conf_name="fitness_tracker_nginx.conf"
script_dir="$(dirname "$0")"
project_conf_path="$script_dir/$project_conf_name"

# Function to install Nginx on Debian/Ubuntu
install_nginx_debian() {
    echo "Updating package lists..."
    sudo apt update
    echo "Installing Nginx..."
    sudo apt install -y nginx
}

# Function to install Nginx on CentOS/RHEL
install_nginx_centos() {
    echo "Installing Nginx..."
    sudo yum install -y nginx
}

# Check if Nginx is installed and install it if it's not
if ! command -v nginx &> /dev/null; then
    echo "Nginx is not installed. Attempting to install..."
    # Attempt to detect the OS
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        case "$ID" in
            debian|ubuntu)
                install_nginx_debian
                ;;
            centos|rhel|fedora)
                install_nginx_centos
                ;;
            *)
                echo "Unsupported operating system."
                exit 1
                ;;
        esac
    else
        echo "Cannot detect operating system. Installation aborted."
        exit 1
    fi
else
    echo "Nginx is already installed."
fi

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

# Check if nginx.conf already has the include directive for sites-enabled
include_directive="include /etc/nginx/sites-enabled/*;"
if ! grep -qE "include\s+/etc/nginx/sites-enabled/\*\s*;" "$nginx_conf"; then
    echo "Adding include directive for sites-enabled in nginx.conf"
    # Use awk to insert include directive after the http block start
    sudo awk "/http {/{print;print \"$include_directive\";next}1" "$nginx_conf" > temp && sudo mv temp "$nginx_conf"
else
    echo "nginx.conf already includes sites-enabled"
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

# Reload Nginx to apply changes
echo "Reloading Nginx"
sudo nginx -t && sudo nginx -s reload

