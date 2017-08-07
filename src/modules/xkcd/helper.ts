import * as Boom from 'boom';
import * as HtmlParser from 'htmlparser';
import * as Promise from 'bluebird';
import * as request from 'request';

const httpRequest: any = Promise.promisifyAll(request);
const nameFind = (value) => {

    return (obj) => {

        return obj.name && obj.name === value;

    };

};
const idFind = (id) => {

    return (obj) => {

        return obj.attribs && obj.attribs.id && obj.attribs.id === id;

    };

};

export default class XkcdHelper {

    constructor () {

        // this.getRandomXkcd();

    }

    extractJson (html: Array<any>) {

        let map = ['html', 'body', '#middleContainer', '#comic', 'img'];
        let img = this.reducer(map, html).attribs;

        return { description: img.title, imageSrc: img.src, title: img.alt };

    }

    getGuidFromRss (feed: Array<any>): number {

        let map = ['rss', 'channel', 'item', 'guid'];
        let guid = this.reducer(map, feed);

        return parseInt(guid[0].data.split('xkcd.com/')[1], 10);

    }

    getLatestXkcd () {

        return this.makeRequest('https://xkcd.com/rss.xml', (response) => {

            let feed = this.parse(response.body);
            return this.getGuidFromRss(feed);

        });

    }

    getRandomXkcd () {

        return this.getLatestXkcd()
        .then((max) => {

            let guid = Math.floor(Math.random() * (max - 1)) + 1;
            // console.log('random guid:', guid);
            return this.getXkcd(guid);

        });

    }

    getXkcd (guid: number) {

        return this.makeRequest(`https://xkcd.com/${guid}/`, (response) => {

            let body = this.parse(response.body);
            return this.extractJson(body);

        });

    }

    makeRequest (url, successHandler) {

        return httpRequest.getAsync({
            method: 'GET',
            url
        })
        .then((response) => {

            if (response.statusCode < 200 || response.statusCode > 299) {

                return Boom.badRequest();

            }

            return successHandler(response);

        })
        .catch((error) => {

            console.log(error);
            return Boom.badData();

        });

    }

    parse (raw): Array<any> {

        let handler = new HtmlParser.DefaultHandler(() => {}, { verbose: false });
        let parser = new HtmlParser.Parser(handler);
        parser.parseComplete(raw);
        return handler.dom;

    }

    reducer (map: Array<String>, initialValue: any) {

        return map.reduce((prev, curr) => {

            let callback = nameFind(curr);
            if (curr.charAt(0) === '#') {

                callback = idFind(curr.slice(1));

            }
            let finder = prev.find(callback);
            return finder.children || finder;

        }, initialValue);

    }

};
