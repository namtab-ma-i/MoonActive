"use strict";
const async = require('async');
const RedisController = require('./RedisController');

let MessageController = {

    processMultiple: (messages, callback) => {
        async.each(
            messages,
            (message, eachCallback) => {
                try{
                    message = JSON.parse(message);
                }catch(e){
                    return eachCallback();
                }
                if(!message || !message.time || !message.message) return eachCallback();
                message.redis = true;
                return MessageController.setTimeout(message, eachCallback);
            },
            callback
        );
    },

    setTimeout: (message, callback) => {
        let time = Date.parse(message.time) - Date.now();
        if(isNaN(time)) return callback();
        time = time > 0 ? time : 0;
        setTimeout(() => {
            console.log(message.message);
            RedisController.delete(message, (err) => {
                if(err) console.error(err);
            });
        }, time);
        return message.redis ? callback() : RedisController.set(message, callback);
    }

};

module.exports = MessageController;