const heartbeat = {
    handler: (request, reply) => {

        reply({ tick: 'tock' });

    },
    method: ['GET'],
    path: '/heartbeat'
};

export { heartbeat };
