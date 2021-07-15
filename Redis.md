# Redis

## Installation and Setup
To install and run this exercices a linux environment is needed.

## 1. Installation
Run the following command and insert password if needed:
```
sudo apt install redis -y
```

## 2. Setup
### 2.1 Check the status of the service
```
systemctl status redis-server
```
If the service is active and running *Active: active (running)* will be included in the output. Congratulations redis is installed properly.
```
● redis-server.service - Advanced key-value store
     Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2021-07-08 15:00:51 CEST; 5min ago
       Docs: http://redis.io/documentation,
             man:redis-server(1)
   Main PID: 976 (redis-server)
      Tasks: 4 (limit: 19112)
     Memory: 4.4M
     CGroup: /system.slice/redis-server.service
             └─976 /usr/bin/redis-server 127.0.0.1:6379

```
### 2.2 For this exercice we will **stop** the automatically started service and start it manually afterwards.

Stop the redis-server
```
systemctl stop redis-server
```

### 2.3 Start redis-server manually
By starting the redis-server manually using the *--loglevel verbose* parameter you'll be able to see all interactions with the server in realtime.
```
redis-server --loglevel verbose
```
The output should look similar to the followering. If you see a warning like 'WARNING you have Transparent Huge Pages (THP) support enabled in your kernel.' > We will ignore this for now :).
```
Jul 2021 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
Jul 2021 # Redis version=5.0.7, bits=64, commit=00000000
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 5.0.7 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 4111
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

Jul 2021 # Server initialized
Jul 2021 * DB loaded from disk: 0.000 seconds
Jul 2021 * Ready to accept connections
Jul 2021 - DB 0: 1 keys (0 volatile) in 4 slots HT.
Jul 2021 - 0 clients connected (0 replicas), 796184 bytes in use
```

### 2.4. Connect
To connect to the previously started redis-server, open another terminal window an run *redis-cli*. This enables you to interact with the redis-server directly.
```
redis-cli
```
The terminal window running the redis-server will display that a client has connected. Now you are ready the get in touch with the redis commands to set and get key-value-keys.
```
Jul 2021 - 0 clients connected (0 replicas), 796136 bytes in use
Jul 2021 - Accepted 127.0.0.1:52370
Jul 2021 - 1 clients connected (0 replicas), 817024 bytes in use

```
# 3. Redis exercise 1
This will help getting acquainted with the most comman redis-commands. Everytime you'll begin typing a command, redis-cli will come up with suggestions how to complete the request.

If you start typing **set** this will expanded to the followering:
```
demo@ubuntu:~$ redis-cli
127.0.0.1:6379> set key value [expiration EX seconds|PX milliseconds] [NX|XX]
```

## 3.1 Set key-value
```
Syntax:
set value key

Examples:
set value1 hello
set value2 world
```
## 3.2 Get value by key
```
Syntax:
get key

Examples:
get value1
get value2

```
## 3.3 Get all available keys
```
Syntax:
keys *

Example:
keys *
```

## 3.4 Remove all key-values from redis-server
```
Syntax:
flushall

Example:
flushall
```

If you'll check all available keys now again, the result should display *(empty list or set)*.

## 3.4 Set key-value with automatically expiration time
This example shows that you can choose the key freely. In this case we decided to use *hw* as key. Furthermore as value you can use any kind of string. Because the value in this case consists of two words, you have to wrapped up with single quotes to ensure it as string.
```
Syntax:
setex key seconds value

Example:
setex hw 30 'Hello World'
```
After running *setex hw 30 'Hello World'* the key-value will be stored for 30 seconds. After this period the key-value will be removed automatically.

Try *get hw* to check if the key-value still exists. In case it was deleted the result should show *(nil)*. Try *get hw* over and over again until the key-value is removed.

## 3.5 Check Time-to-Live (TTL)
With the ttl command you can check the seconds till a key-value automatically will be removed from the redis-server.
```
Syntax:
ttl key

Example:
ttl hw
```
If you followed the exercise *ttl hw* results *(integer) -2*, meaning no key-value was found. If a key-value was found, but no expiration time was set for this key, the result will be *(integer) -1* meaning that this key-value won't expire.

Set the previous key-value with expiration time again. This time with 120 seconds.
```
setex hw 120 'Hello World'
```
Use *ttl hw* to check the TTL of the key hw. This time for the next 120 seconds this should results *(integer) any number between 0 - 120 seconds*

# 4. Redis exercise 2 - Cluster
Now will change the running redis-server to be able to act as a part of a redis-cluster 

## 4.1 Creating the redis.config
To act as cluster-node some additonal config-parameter are needed. We will create our own redis.config file. Maybe you'll use the beloved nano editor for that, than the command will look like:
```
nano redis.conf
```
Copy-Past the following parameters into the redis.config file and save it to disk. Please help each other with questions.
```
port 7000
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes
protected-mode no
```


| Parameter | Explanation |
| -------- | -------- |
| port 7000     | the port on which the client is reachable     |
| cluster-enabled yes     | enables redis-server running in cluster mode     |
| cluster-config-file nodes.conf     | Every Redis Cluster node requires a different cluster configuration file     |
| cluster-node-timeout 5000     | amount of milliseconds a node must be unreachable for it to be considered in failure state     |
| appendonly yes     | enables an alternative persistence mode that provides much better durability |
| protected-mode no     | allows clients from other host to communicate to each other     |


## 4.2 Running redis-server in cluster mode
To start redis-server using the previously created config-file you just use it as first parameter:
```
redis-server redis.config
```

You should get an output similar to that:
```
Jul 2021 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
Jul 2021 # Redis version=5.0.7, bits=64, commit=00000000, modified=0, pid=18074
Jul 2021 # Configuration loaded
Jul 2021 * Increased maximum number of open files to 10032
Jul 2021 * No cluster configuration found, I'm 5f5355e6cfba74817d23356ba018165de6e3f8e4
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 5.0.7 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in cluster mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 7000
 |    `-._   `._    /     _.-'    |     PID: 18074
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

Jul 2021 # Server initialized
Jul 2021 * Ready to accept connections
```
Please notice that it's saying: *Running in cluster mode* and that there is an ID: *I'm 5f5355e6cfba74817d23356ba018165de6e3f8e4* which is the unique address for this node.

## 4.3 Wait for your colleagues
If you have setup redis-server as shown at 4.2 you have to wait for you colleagues the reach that status as well. If all your cluster-nodes are running, we will go on and finally connect them to one big cluster communicating to each other.

## 4.4 Create the redis-cluster
After all your single nodes are running properly, we will now create the cluster. **This will be done by only one your group members**. So please coordinate yourselves well who of you will do this. The following outputs will also only visible for the team member that's selected to create the cluster.

Each redis-node is reachable via the unique ip-address of the machine it's running on. To create you cluster use the command *redis-cli --cluster create* followed by a list of all you ip-addresses and there ports.

Example command for pcs pc01, pc02, pc03, pc04, pc05 and pc06

```
redis-cli --cluster create \
192.168.75.21:7000 \
192.168.75.22:7000 \
192.168.75.23:7000 \
192.168.75.24:7000 \
192.168.75.25:7000 \
192.168.75.26:7000 \
--cluster-replicas 1
```

After runnign this command **three master nodes** as well as **three replica nodes** should be created. Please confirm the proposed configuration with *YES*.
(Ip-Addresses may and IDs will be different to this example output)
```
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 192.168.75.25:7000 to 192.168.75.21:7000
Adding replica 192.168.75.26:7000 to 192.168.75.22:7000
Adding replica 192.168.75.24:7000 to 192.168.75.23:7000

M: 6289162b2a785b0659ecbf48fa46ba3e301bb0ac 192.168.75.21:7000
   slots:[0-5460] (5461 slots) master
M: 19c0e8512ca8f24f07b5832f73954b430154fc74 192.168.75.22:7000
   slots:[5461-10922] (5462 slots) master
M: 5f5355e6cfba74817d23356ba018165de6e3f8e4 192.168.75.23:7000
   slots:[10923-16383] (5461 slots) master
S: f9764fda0a554e801274ca1264472d54bbc8f53b 192.168.75.24:7000
   replicates 5f5355e6cfba74817d23356ba018165de6e3f8e4
S: f755d2ea17a59bcc8acaea4950126f6089f7193c 192.168.75.25:7000
   replicates 6289162b2a785b0659ecbf48fa46ba3e301bb0ac
S: a7accc10d8349fc0bc6569f7b305bcd994f5298b 192.168.75.26:7000
   replicates 19c0e8512ca8f24f07b5832f73954b430154fc74
   
Can I set the above configuration? (type 'yes' to accept): 
```

If the configuration was successfull the following out is shown.
```
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
..
>>> Performing Cluster Check (using node 192.168.75.21:7000)
M: 6289162b2a785b0659ecbf48fa46ba3e301bb0ac 192.168.75.21:7000
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 19c0e8512ca8f24f07b5832f73954b430154fc74 192.168.75.22:7000
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: f9764fda0a554e801274ca1264472d54bbc8f53b 192.168.75.24:7000
   slots: (0 slots) slave
   replicates 5f5355e6cfba74817d23356ba018165de6e3f8e4
S: f755d2ea17a59bcc8acaea4950126f6089f7193c 192.168.75.25:7000
   slots: (0 slots) slave
   replicates 6289162b2a785b0659ecbf48fa46ba3e301bb0ac
M: 5f5355e6cfba74817d23356ba018165de6e3f8e4 192.168.75.23:7000
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: a7accc10d8349fc0bc6569f7b305bcd994f5298b 192.168.75.26:7000
   slots: (0 slots) slave
   replicates 19c0e8512ca8f24f07b5832f73954b430154fc74
   
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.

```

All team members should see an output similar to this.

**If your node has become a master node:**
```
Jul 2021 # configEpoch set to 6 via CLUSTER SET-CONFIG-EPOCH
Jul 2021 # IP address for this node updated to 192.168.75.26
Jul 2021 * Before turning into a replica, using my master parameters to synthesize a cached master: I may be able to synchronize with the new master with just a partial transfer.
Jul 2021 # Cluster state changed: ok
Jul 2021 * Connecting to MASTER 192.168.75.22:7000
Jul 2021 * MASTER <-> REPLICA sync started
Jul 2021 * Non blocking connect for SYNC fired the event.
Jul 2021 * Master replied to PING, replication can continue...
Jul 2021 * Trying a partial resynchronization (request 7624d57eefcf05381154ecb03ef4f6f018524964:1).
Jul 2021 * Full resync from master: 4fcedcfd240f9e1e9b62c73866d2428d72b1ff92:0
Jul 2021 * Discarding previously cached master state.
Jul 2021 * MASTER <-> REPLICA sync: receiving 175 bytes from master
Jul 2021 * MASTER <-> REPLICA sync: Flushing old data
Jul 2021 * MASTER <-> REPLICA sync: Loading DB in memory
Jul 2021 * MASTER <-> REPLICA sync: Finished with success
Jul 2021 * Background append only file rewriting started by pid 19927
Jul 2021 * AOF rewrite child asks to stop sending diffs.
Jul 2021 * Parent agreed to stop sending diffs. Finalizing AOF...
Jul 2021 * Concatenating 0.00 MB of AOF diff received from parent.
Jul 2021 * SYNC append only file rewrite performed
Jul 2021 * AOF rewrite: 0 MB of memory used by copy-on-write
Jul 2021 * Background AOF rewrite terminated with success
Jul 2021 * Residual parent diff successfully flushed to the rewritten AOF (0.00 MB)
Jul 2021 * Background AOF rewrite finished successfully
```


**If your node has become a replica node:**
```
Jul 2021 # configEpoch set to 1 via CLUSTER SET-CONFIG-EPOCH
Jul 2021 # IP address for this node updated to 192.168.75.21
Jul 2021 * Replica 192.168.75.25:7000 asks for synchronization
Jul 2021 * Partial resynchronization not accepted: Replication ID mismatch (Replica asked for '21a5523027209531acebef590d4b063a60271c54', my replication IDs are '6a94bd0a2299a48751fe08d8a80c1254eb16b879' and '0000000000000000000000000000000000000000')

Jul 2021 * Starting BGSAVE for SYNC with target: disk
Jul 2021 * Background saving started by pid 19109
Jul 2021 * DB saved on disk
Jul 2021 * RDB: 0 MB of memory used by copy-on-write
Jul 2021 * Background saving terminated with success
Jul 2021 * Synchronization with replica 192.168.75.25:7000 succeeded
Jul 2021 # Cluster state changed: ok
```

# 5. Run a real-world application on you cluster
 Each team member should do this part for themselves. To keep you clustern running it's important to **not close the terminal / window** your node in running at!

## 5.1 Establish a second connection to LinuxLab
You have to establish a **second connection to the LinuxLab in an seperate terminal / window**. Please use the same pc## you used before (if your node is running on pc01, also establish the second connection to pc01).

## 5.2 Clone the demo application
We've created a demo application that will retrieve metadata of 300 pictures from https://jsonplaceholder.typicode.com and will cache them for 120 seconds. You have to clone the application from git and install its dependencies. 

| Parameter | Explanation |
| -------- | -------- |
| git clone     | clones the repo into a folder called 'key-value-stores'     |
| cd key-value-stores/demo     | changes directory to 'key-value-stores/demo'     |
| npm i     | installes all dependencies     |


Copy-Paste
```
git clone https://github.com/mikeptrsn/key-value-stores.git \
cd key-value-stores/demo \
npm i
```

## 5.3 Configure the demo application
To connect the application with your redis cluster, all the ip-addresses of the nodes your team is using must be known by the application. There for you have to edit a file named .env

To open the file use (you must be within the key-value-stores/demo folder)
```
nano .env
```

Please change the ip-addresses of NODE1 to NODE6. Save and close the file.
```
# total amount of nodes (must be even)
NODES = 6

# must match the ips of your group
NODE1 = '192.168.75.##'
NODE2 = '192.168.75.##'
NODE3 = '192.168.75.##'
NODE4 = '192.168.75.##'
NODE5 = '192.168.75.##'
NODE6 = '192.168.75.##'
```

## 5.4 Running the demo application
Now everything is setup to run the application. The application will run and exit.

Run the application and watch the console logs. You'll see if the request was cached as well as timing informations. Also in the other terminal / window, you redis-node should to some work. Observe this as well.

```
node demo.js
```

Rerun the application and compare the console logs. What happened to the caching-state and what to the timing.

1. Discuss what you saw the first and the second run.

2. The observations can be quit different from team member to team member. Discusses the possible reasons for this