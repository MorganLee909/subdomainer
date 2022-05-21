const express = require("express");
const vhost = require("vhost");
const https = require("https");
const fs = require("fs");

const app = express()
    .use(vhost("leemorgan.io", require("../lee-morgan-site/app.js")))
    .use(vhost("www.leemorgan.io", require("../lee-morgan-site/app.js")))
    .use(vhost("something.leemorgan.io", require("../lee-morgan-site/app.js")))
    .use((req, res, next)=>{
        if(req.secure === true){
            next();
        }else{
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });

let httpsServer = https.createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/leemorgan.io/privkey.pem", "utf8"),
    cert: fs.readFileSync("/etc/letsencrypt/live/leemorgan.io/fullchain.pem", "utf8")
}, app);

httpsServer.listen(process.env.HTTPS_PORT);
app.listen(process.env.PORT);