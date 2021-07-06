#!/bin/bash

# based on the following source: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04


##### INSTALLATION #####

#  update package list
sudo apt update

# install prerequisite packages
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# add GPG key for Docker repo
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# add Docker repo to system
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# add Docker repo to APT sources
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

# update the package database
sudo apt update
apt-cache policy docker-ce

# install docker
sudo apt install docker-ce

##### POST-INSTALLATION-STEPS #####

# create docker group and add your user
sudo groupadd docker 2> /dev/null

sudo usermod -aG docker $USER

# re-evaluate group memberships
newgrp docker