<div align="center">
<img src="https://sharex.nilskleinert.de/widget.png" height="200px" />
<h3 align="center">Easy Proxmox Server Monitoring</h3>
<h6 align="center">With Node.js and Scriptable (for iOS)</h6>
</div>


## 🗂 Table of Contents

* [How it works](#-how-it-works)
* [Server configuration](#-server-configuration)
* [Client (Scriptable) configuration](#-client-scriptable-configuration)


## 🤔 How it works
The project is divided into two parts. The "Server" part and the "Scriptable" part.  
Actually self-explanatory. The server part takes care of the connection with Proxmox and reads the status of your virtual machines.  
The scriptable part prepares this data and shows it to you.

## ‍💻 Server configuration
You don't have to change anything in the server's Javascript code.  
You only have to adjust the following `config.json`. That's it.  
And of course don't forget to start the server with `node main.js`.  
Here is the config.json first, then I explain the configuration.

```json
{
  "proxmox": {
    "user": "root@pam!widget",
    "token": "YOURTOKEN",
    "hostname": "HOSTNAME:PORT"
  },
  "webserver": {
    "port": 3000
  },
  "settings": {
    "refresh": 10000
  }
}
```

In this example, a token with the name "widget" was created.  
The field user is self-explanatory, there you enter the username.  
In the Token field, enter the token (secret) that you have created.  
At Hostname enter the URL where you can reach Proxmox, with Port.

Now the configuration for Proxmox is complete. 🥳  
Let's continue with the configuration for the web server.

At Port you enter any port under which our server should be reachable later.  
Remember that this port should be reachable from the outside, so that the widget works.

Very good, you can optionally adjust refresh. With the configuration you can define how often the server refreshes the state of your virtual machines (seconds).

## 🛠️ Client (Scriptable) configuration
The configuration from the client is quite simple.  
In `widget.js` you only need to set the URL from the backend (our Node.js server).  
That was it. As a test, just try to open the server URL in the browser.  
You can get the current script for the widget like this: http://IP:PORT/scriptable
