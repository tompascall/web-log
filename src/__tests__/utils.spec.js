const utils = require('../utils');

describe('utils', () => {
  describe('getParsedQuery', () => {
    it('should parse query string of url', () => {
      let parsedQuery = utils.getParsedQuery({
        url: 'http://fakehost.hu/budapest?foo=oo&bar=ar'
      });
      expect(parsedQuery).toEqual({foo: 'oo', bar: 'ar'});
    });
  });
});
