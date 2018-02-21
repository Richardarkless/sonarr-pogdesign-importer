"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const cheerio = require("cheerio");
const node_fetch_1 = require("node-fetch");
class PogDesign {
    constructor(config) {
        this.DATE_STRING = 'MMMM-YYYY';
        this.URL = 'https://www.pogdesign.co.uk';
        this.SELECTOR = '#data>.pgwidth';
        this.SHOW_CLASS = 'contbox prembox removed';
        this.TITLE_SELECTOR = 'h2';
        this.SELECTED_SELECTOR = '.hil.selby';
        this.SELECTED_REGEX = /.+?(\d+).+/g;
        this.config = config;
    }
    extractSelectedCount(text) {
        let count = 3;
        while (count--) {
            let selected = this.SELECTED_REGEX.exec(text);
            if (selected && selected.length) {
                return parseInt(selected[1]);
            }
        }
        return -1;
    }
    getItem(child) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = child.find(this.TITLE_SELECTOR).text();
            const selectedText = child.find(this.SELECTED_SELECTOR).text();
            const selectedCount = this.extractSelectedCount(selectedText);
            if (selectedCount > this.config.minimumStars) {
                const result = {
                    title: title,
                    stars: selectedCount
                };
                return result;
            }
            else if (this.config.verbose) {
                console.log(`${title} skipped because it only has ${selectedCount} stars`);
            }
            return null;
        });
    }
    getItems(html) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            if (!html || !html.length) {
                return result;
            }
            const $ = cheerio.load(html);
            const children = $(this.SELECTOR).children();
            for (let i = 0; i < children.length; i++) {
                let child = $(children.get(i));
                if (child.hasClass(this.SHOW_CLASS)) {
                    const item = yield this.getItem(child);
                    if (item) {
                        result.push(item);
                    }
                }
                else if (result.length) {
                    break;
                }
            }
            return result;
        });
    }
    scrapeUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = [];
            const res = yield node_fetch_1.default(url);
            const text = yield res.text();
            items = yield this.getItems(text);
            return items;
        });
    }
    process(fromDate, toDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const months = toDate.getMonth() - fromDate.getMonth();
            let date = fromDate;
            let result = [];
            for (let i = 0; i <= months; i++) {
                const url = this.getUrl(date);
                const items = yield this.scrapeUrl(url);
                result = result.concat(items);
                date.setMonth(date.getMonth() + 1);
            }
            return result;
        });
    }
    getUrl(date) {
        const dateFormat = this.getDateFormat(date);
        const result = `${this.URL}/cat/TV-shows-starting-${dateFormat}`;
        return result;
    }
    getDateFormat(date) {
        const result = moment(date).format(this.DATE_STRING);
        return result;
    }
}
exports.default = PogDesign;
