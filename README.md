# demo-phaser-api
for practice phaser and its api.

## 环境搭建
开发时尽量使用server存放静态资源，否则在使用WebGL渲染的时候，无法加载资源，本次使用`http-server`搭建本地服务：
```
npm install -g http-server
http-server
```
```
Starting up http-server, serving ./

http-server version: 14.1.1

http-server settings:
CORS: disabled
Cache: 3600 seconds
Connection Timeout: 120 seconds
Directory Listings: visible
AutoIndex: visible
Serve GZIP Files: false
Serve Brotli Files: false
Default File Extension: none

Available on:
  http://10.10.0.35:8080
  http://127.0.0.1:8080
  http://172.18.32.1:8080
Hit CTRL-C to stop the server
```