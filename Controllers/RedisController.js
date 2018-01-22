"use strict";
const redis = require('redis');
require('redis-delete-wildcard')(redis);
const crypto = require('crypto');
const Config = require('../Config/config.json');

let RedisController = {

    client: null,

    connect: (callback) => {
        RedisController.client = redis.createClient(Config.redis);
        return callback();
    },

    get: (callback) => {
        return RedisController.client.keys('*', (err, keys) => {
            keys = keys.length > 0 ? keys : '';
            return RedisController.client.mget(keys, callback);
        });
    },

    set: (message, callback) => {
        const hash = crypto.createHash('md5').update(`${Date.now()}`).digest('hex');
        const key = `${Date.parse(message.time)}_${hash}`;
        return RedisController.client.set(key, JSON.stringify(message), callback);
    },

    delete: (message, callback) => {
        const hash = `${Date.parse(message.time)}_*`;
        return RedisController.client.delwild(hash, callback);
    }
};

module.exports = RedisController;
