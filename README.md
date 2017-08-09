# Wechat bot

一个简单的微信机器人，用来自动向某个用户发送消息。

### 如何使用

- 克隆本项目
- 执行 `npm install`
- 执行 `docker run --name wechat-bot -d -it --restart always -e PORT=3000 -p 3000:3000 -e "WECHAT_BOT_CONTACT=接受消息的用户名称" -e "WECHAT_BOT_SECRET=secret" -v "$(pwd)":/bot zixia/wechaty index.js`
- 执行 `docker logs wechat-bot`

由于运行 docker 的时候是以 daemon 的模式运行的，因此需要手动进入 docker logs 来查询日志。此时查看 log 稍等一会会出现一个微信登录的二维码，这时候再用手机微信扫码登录，登录成功之后 log 会显示具体哪个账号登录了。这时候就可以关掉 log ，继续下一个步骤。

程序运行之后会运行一个简单的 web 服务器，向该 web 服务器请求具体的发送消息的接口即可以实现向具体某个微信好友发送消息。

### web 服务器 API

#### /message

- method: POST
- data: 
    + secret: 程序的密文，主要用来验证身份。其值是在通过运行 docker 容器时指定的 `WECHAT_BOT_SECRET` 环境变量
    + content: 具体的消息内容

### docker 容器环境变量

- PORT: 程序监听的端口
- WECHAT_BOT_CONTACT: 指定想要发送的好友的名称
- WECHAT_BOT_SECERT: 程序的密文，用来作为身份验证

### 事例

```bash
curl -X POST -d "secret=secret&conten=hellworld" http://hostname:port/message
```

请求成功之后即会向指定的微信好友发送消息。
