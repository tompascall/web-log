import get from '../get';
import filter from '../filter.js';
import { mockEntryGenerator, mockRawEntryGenerator } from '../mocks/mocks';

let entries;

describe('filterByMethod', () => {

  beforeAll( () => {
    entries = [
      mockEntryGenerator({
        method: "Network.requestWillBeSent",
        url: "www/testurl1?testparam1=1&testparam2=2"
      }),
      mockEntryGenerator({ method: "Network.loadingFailed"})
    ]
  });

  it('filters entries by method', () => {
    let method = 'Network.loadingFailed';
    let filteredEntries = filter.entriesByMethod({ entries, method }).filteredEntries;
    expect(filteredEntries.length).toEqual(1);
 });

});

describe('entriesByUrlPart', () => {

  beforeAll( () => {
    entries = [
      mockEntryGenerator({
        method: "Network.requestWillBeSent",
        url: "www/testurl1?testparam1=1&testparam2=2"
      }),
      mockEntryGenerator({
        method: "Network.responseReceived",
        url: "www/testurl1?testparam1=1&testparam2=2"
      })
    ]
  });

  it('filters entries by urlPart', () => {
    expect(filter.entriesByUrlPart( { entries, urlPart: 'testurl1'}).filteredEntries.length).toEqual(2);
  });
});

describe('filters can be chained', () => {

  beforeAll( () => {
    entries = [
      mockEntryGenerator({
        method: "Network.requestWillBeSent",
        url: "www/testurl1?testparam1=1&testparam2=2",
        fakeProperty: 'fakeData'
      }),
      mockEntryGenerator({
        method: "Network.requestWillBeSent",
        url: "www/testurl3?testparam1=1&testparam2=2",
      }),
      mockEntryGenerator({
        method: "Network.responseReceived",
        url: "www/testurl1?testparam1=1&testparam2=2"
      }),
    ]
  });

  it('filters can be chained', () => {
    let filteredChainResult = filter
      .entriesByMethod( { entries, method: 'Network.requestWillBeSent'})
      .entriesByUrlPart( { urlPart: 'testurl1'});
    let filteredEntries = filteredChainResult.filteredEntries;
    expect(filteredEntries.length).toEqual(1);
    expect(filteredEntries[0].message.fakeProperty).toEqual('fakeData');
    expect(typeof filteredChainResult.entriesByMethod).toEqual('function');
    expect(typeof filteredChainResult.entriesByUrlPart).toEqual('function');
  });
});
