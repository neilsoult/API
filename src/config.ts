import * as globby from 'globby';
import * as Hapi from 'hapi';

const routes = process.env.GLOB_ROUTES || ['**/routes.js'];

export default class Server {

    protected server: Hapi.Server;

    constructor () {

        this.server = new Hapi.Server();
        this.server.connection({
            port: +process.env.PORT || 3001,
            routes: { cors: true }
        });

        this.initializeRoutes();
        this.server.start(() => {

            console.log(`Server running at ${this.server.info.uri}`);

        });

    }

    walkThroughRoutes = (path) => {

        let routes = require(process.cwd() + '/' + path);
        Object.keys(routes).forEach((routeName) => {

            try {

                console.log(`routeName: ${routeName}`);
                this.server.route(routes[routeName]);

            } catch (err) {

                console.log(`route error: ${err}`);

            }

        });

    }

    initializeRoutes () {

        console.log('-- initializing routes --');

        globby(routes)
        .then((paths) => {

            paths.forEach(this.walkThroughRoutes);
            console.log('-- routes loaded --');

        });

    }

}
