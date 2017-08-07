import * as joi from 'joi';
import XkcdHelper from './helper';

let helper = new XkcdHelper();

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

export { getXkcd, randomXkcd };
