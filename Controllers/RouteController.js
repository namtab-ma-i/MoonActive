"use strict";
const urlp = require('url');
const MessageController = require('../Controllers/MessageController');

let EchoUtils = {

    echoGood: (res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ok');
    },

    echoBad: (res, err) => {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(`{"error":"${err}"`);
    }

};

let RouteController = {

    onRequest: (req, res) => {
        const path = urlp.parse(req.url, true).pathname;

        if(path !== '/echoAtTime')
            return EchoUtils.echoBad(res);

        let message = '';
        req.on('data', (data) => {
            message += data;
        });

        req.on('end', () => {
            try{
                message = JSON.parse(message);
            } catch (err){
                return EchoUtils.echoBad(res, err);
            }

            return MessageController.setTimeout(
                message,
                (err) => err ? EchoUtils.echoBad(res, err) : EchoUtils.echoGood(res)
            );
        });

    },

};

module.exports = RouteController;