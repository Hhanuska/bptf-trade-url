import axios from 'axios';
import cheerio from 'cheerio';

/**
 * Get a user's trade URL form steamid
 * @param {String} steamid steamid
 * @param {String} [cookies] cookies to use with your request
 * @return {String|null} trade url, null if trade url is not set
 */
export async function fromProfile (steamid, cookies = null) {
    try {
        const response = await axios({
            method: 'GET',
            url: 'https://backpack.tf/u/' + steamid,
            headers: {
                Cookie: cookies
            }
        });

        const $ = cheerio.load(response.data);

        const url = $('.title').children().first().children().first().data('offers-params');

        return url ? url : null;
    } catch (err) {
        return err;
    }
}


/**
 * Get all users trade URLs on a page
 * @param {String} url URL to classifieds listings page, stats page of an item or other pages, like /u/steamid
 * @param {String} [cookies] cookies to use with your request
 * @return {Object} urls, steamid: url
 */
export async function fromClassifieds (url, cookies = null) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            headers: {
                Cookie: cookies
            }
        });

        return _getUrls(response.data);
    } catch (err) {
        return err;
    }
}

/**
 * You can use this function if you already request a page to avoid usless requests
 * @param {String} html page html
 */
export function _getUrls (html) {
    const $ = cheerio.load(html);

    const urls = {};

    $('.user-handle').each((i, e) => {
        const steamid = $(e).children().first().data('id');

        const url = $(e).children().first().data('offers-params');

        urls[steamid] = url ? url : null;
    })

    return urls;
}
