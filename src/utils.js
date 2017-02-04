import nodeUrl from 'url';

const utils = {
  getParsedQuery ({ url } = {}) {
    return nodeUrl.parse(url, true).query;
  }
};

export default utils;
