const nodeUrl = require('url');

const utils = {
  getParsedQuery ({ url } = {}) {
    return nodeUrl.parse(url, true).query;
  }
};

module.exports = utils;
