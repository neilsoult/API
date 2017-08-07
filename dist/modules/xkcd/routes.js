"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const helper_1 = require("./helper");
let helper = new helper_1.default();
const getXkcd = {
    config: {
        handler: (request, reply) => {
            helper.getXkcd(request.params.guid)
                .then((json) => {
                reply(json);
            });
        },
        validate: {
            params: {
                guid: joi.number()
            }
        }
    },
    method: ['GET'],
    path: '/xkcd/{guid}'
};
exports.getXkcd = getXkcd;
const randomXkcd = {
    handler: (request, reply) => {
        helper.getRandomXkcd()
            .then((json) => {
            reply(json);
        });
    },
    method: ['GET'],
    path: '/xkcd'
};
exports.randomXkcd = randomXkcd;
