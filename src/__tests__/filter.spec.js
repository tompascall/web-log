import get from '../get';
import filter from '../filter.js';
import mockDriver from '../mocks/mocks';

describe('filterByMethod', () => {
  let entries;

  beforeEach( () => {
    return get.getRawEntries({driver : mockDriver})
    .then( (result) => {
      entries = result;
    });
  });

 it('filters entries by method', () => {
   let method = 'Network.requestWillBeSent';
   let filteredEntries = filter.filterEntriesByMethod({ entries, method }).filteredEntries;
   expect(filteredEntries.length).toEqual(1);
 });
});
