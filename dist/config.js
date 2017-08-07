"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby = require("globby");
const Hapi = require("hapi");
const routes = process.env.GLOB_ROUTES || ['**/routes.js'];
class Server {
    constructor() {
        this.walkThroughRoutes = (path) => {
            let routes = require(process.cwd() + '/' + path);
            Object.keys(routes).forEach((routeName) => {
                try {
                    console.log(`routeName: ${routeName}`);
                    this.server.route(routes[routeName]);
                }
                catch (err) {
                    console.log(`route error: ${err}`);
                }
            });
        };
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
    initializeRoutes() {
        console.log('-- initializing routes --');
        globby(routes)
            .then((paths) => {
            paths.forEach(this.walkThroughRoutes);
            console.log('-- routes loaded --');
        });
    }
}
exports.default = Server;
