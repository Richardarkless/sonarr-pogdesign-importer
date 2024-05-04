"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class SonarrApi {
    constructor(config) {
        this.url = config.sonarr.url;
        this.apiKey = config.sonarr.apiKey;
    }
    lookupSeries(term) {
        term = encodeURIComponent(term);
        const url = `${this.url}/api/v3/series/lookup?term=${term}`;
        return node_fetch_1.default(url, {
            headers: {
                'X-Api-Key': this.apiKey
            }
        });
    }
    addSeries(series) {
        const url = `${this.url}/api/v3/series`;
        return node_fetch_1.default(url, {
            headers: {
                'X-Api-Key': this.apiKey
            },
            method: 'POST',
            body: JSON.stringify(series)
        });
    }
    getProfiles() {
        const url = `${this.url}/api/v3/profile`;
        return node_fetch_1.default(url, {
            headers: {
                'X-Api-Key': this.apiKey
            }
        });
    }
    getPaths() {
        const url = `${this.url}/api/v3/rootfolder`;
        return node_fetch_1.default(url, {
            headers: {
                'X-Api-Key': this.apiKey
            }
        });
    }
    getSeries() {
        const url = `${this.url}/api/v3/series`;
        return node_fetch_1.default(url, {
            headers: {
                'X-Api-Key': this.apiKey
            },
        });
    }
}
exports.default = SonarrApi;
