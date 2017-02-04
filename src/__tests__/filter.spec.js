import get from '../get';
import filter from '../filter.js';
import { mockEntryGenerator } from '../mocks/mocks';

let entries;

describe('filterByMethod', () => {

  beforeAll( () => {
    entries = [
      mockEntryGenerator({ message: {
        method: "Network.requestWillBeSent",
        params: {
          request: {
            url: "www/testurl1?testparam1=1&testparam2=2"
          }
        }
      }}),
      mockEntryGenerator({message: {
        method: "Network.loadingFailed",
        params: {
        }
      }})
    ]
  });

  it('filters entries by method', () => {
    let method = 'Network.loadingFailed';
    let filteredEntries = filter.filterEntriesByMethod({ entries, method }).filteredEntries;
    expect(filteredEntries.length).toEqual(1);
 });

});

describe('entriesByUrlPart', () => {

  beforeAll( () => {
    entries = [
      mockEntryGenerator({ message: {
        method: "Network.requestWillBeSent",
        params: {
          request: {
            url: "www/testurl1?testparam1=1&testparam2=2"
          }
        }
      }}),
      mockEntryGenerator({ message: {
        method: "Network.responseReceived",
        params: {
          response: {
            url: "www/testurl1?testparam1=1&testparam2=2"
          }
        }
      }}),
    ]
  });
  it('filters entries by urlPart', () => {
    expect(filter.entriesByUrlPart( { entries, urlPart: 'testurl1'}).length).toEqual(2);  
  });
});
