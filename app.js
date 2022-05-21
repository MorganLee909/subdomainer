const express = require("express");
const vhost = require("vhost");
const https = require("https");
const fs = require("fs");

const app = express()
        .use(vhost("blacklist.aero", require("../blacklist-aero/app.js")))
        .use(vhost("www.blacklist.aero", require("../blacklist-aero/app.js")))
        .use(vhost("test.blacklist.aero", require("../blacklist-aero-test/app.js")))
        .use((req, res, next)=>{
                if(req.secure === true){
                        next();
                }else{
                        res.redirect(`https://${req.headers.host}${req.url}`);
                }
        });

let httpsServer = https.createServer({
        key: fs.readFileSync("/etc/letsencrypt/live/blacklist.aero/privkey.pem", "utf8"),
        cert: fs.readFileSync("/etc/letsencrypt/live/blacklist.aero/fullchain.pem", "utf8")
}, app);

httpsServer.listen(process.env.HTTPS_PORT);
app.listen(process.env.PORT);