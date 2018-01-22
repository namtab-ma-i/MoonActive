"use strict";
const async = require('async');
const http = require('http');
const MessageController = require('./Controllers/MessageController');
const RouteController = require('./Controllers/RouteController');
const RedisController = require('./Controllers/RedisController');
const Config = require('./Config/config.json');

let Application = {

    startService: (callback) => {
        http.createServer(RouteController.onRequest).listen(Config.application.port);
        return callback();
    },

    run: () => {

        async.waterfall([

            (callback) => RedisController.connect(callback),

            (callback) => RedisController.get(callback),

            (messages, callback) => MessageController.processMultiple(messages, callback),

            (callback) => Application.startService(callback)

        ], (err) => {
            if(err)
                console.error(err);
            else
                console.log('Started');
        });

    }

};

Application.run();