# !/bin/bash

cd ~ && git clone https://github.com/redis/redis.git

cd redis && make

cd ~ && mkdir cluster_test

cd cluster_test &&  cat <<EOF >> redis.conf
port 7000
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes
dir /home/ubuntu/cluster_test
protected-mode no
bind $(hostname -I)
EOF
