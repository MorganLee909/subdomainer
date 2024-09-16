import express from "express";
import vhost from "vhost";
import https from "https";
import fs from "fs";

import example from "../example/app.js";

const app = express()
    .use(vhost("example.com", example))
    .use(vhost("www.example.com", example))
    .use((req, res, next)=>{
        if(req.secure === true){
            next();
        }else{
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });

let httpsServer = https.createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/example.com/privkey.pem", "utf8"),
    cert: fs.readFileSync("/etc/letsencrypt/live/example.com/fullchain.pem", "utf8")
}, app);

httpsServer.listen(process.env.HTTPS_PORT);
app.listen(process.env.PORT);
