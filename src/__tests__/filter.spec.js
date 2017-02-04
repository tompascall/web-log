import get from '../get';
import filter from '../filter.js';
import mockDriver from '../mocks/mocks';

describe('filterByMethod', () => {
  let entries;

  beforeAll( () => {
    return get.entries({driver : mockDriver})
    .then( (result) => {
      entries = result;
    });
  });

 it('filters entries by method', () => {
   let method = 'Network.loadingFailed';
   let filteredEntries = filter.filterEntriesByMethod({ entries, method }).filteredEntries;
   expect(filteredEntries.length).toEqual(1);
 });

  it('filters entries by urlPart', () => {
    expect(filter.entriesByUrlPart( { entries, urlPart: 'testurl1'}).length).toEqual(2);  
  });
});
