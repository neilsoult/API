"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const heartbeat = {
    handler: (request, reply) => {
        reply({ tick: 'tock' });
    },
    method: ['GET'],
    path: '/heartbeat'
};
exports.heartbeat = heartbeat;
