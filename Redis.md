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
Copy-Past the following parameters into the redis.config file and save it to disk.
```
port 7000
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes
protected-mode no
```

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
```
Please notice that it's saying: *Running in cluster mode* and that there is an ID: *I'm 5f5355e6cfba74817d23356ba018165de6e3f8e4* which is the unique address for this node.

## 4.3 Wait for your colleagues
If you have setup redis-server as shown at 4.2 you have to wait for you colleagues the reach that status as well. If all your cluster-nodes are running, we will go on and finally connect them to one big cluster communicating to each other.

