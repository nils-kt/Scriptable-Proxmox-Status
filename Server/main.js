const config = require("./config.json"),
    proxmox = require("proxmox-client"),
    express = require("express"),
    app = express(),
    fs = require('fs');

proxmox.auth(config.proxmox.hostname, config.proxmox.user, config.proxmox.token).then(() => {

    let allServers = [];

    getServers();

    function getServers() {
        proxmox.get("/nodes").then((res) => {
            if (res.status !== 200) {
                console.log("statusCode is not 200");
                return;
            }
            allServers = [];
            res = JSON.parse(res.text).data;
            for (let node = 0; node < res.length; node++) {
                allServers.push({
                    "type": "node",
                    "name": res[node].node,
                    "uptime": res[node].uptime,
                    "status": res[node].status
                });
                proxmox.get("/nodes/" + res[node].node + "/qemu").then((res) => {
                    if (res.status !== 200) {
                        console.log("statusCode is not 200");
                        return;
                    }
                    let servers = JSON.parse(res.text).data;
                    for (let vm = 0; vm < servers.length; vm++) {
                        allServers.push({
                            "type": "vm",
                            "name": servers[vm].name,
                            "uptime": servers[vm].uptime,
                            "status": servers[vm].status
                        });
                    }
                }).catch((err) => {
                    console.log("Error:", err);
                });
            }
        }).catch((err) => {
            console.log("Error:", err);
        });
    }

    app.get('/', (req, res) => {
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(allServers));
    })

    app.get('/scriptable', (req, res) => {
        fs.readFile("../Scriptable/widget.js", "utf8", function (err, data) {
            if (err) throw err;
            res.set("Content-Type", "text/plain");
            res.send(data);
        });
    })

    app.listen(config.webserver.port, () => {
        console.log(`Widget API reachable: http://localhost:${config.webserver.port}`)
    })

    setInterval(() => {
        getServers();
    }, config.settings.refresh);
}).catch((err) => {
    console.log(err);
});
