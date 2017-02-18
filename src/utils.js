const nodeUrl = require('url');

const utils = {
  getParsedQuery ({ url } = {}) {
    return nodeUrl.parse(url, true).query;
  },
  logColors: {
    fgGreen : "\x1b[32m",
    fgYellow : "\x1b[33m",
    fgRed : "\x1b[31m",
    reset : "\x1b[0m"
  }
};

module.exports = utils;
