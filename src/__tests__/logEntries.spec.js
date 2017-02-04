import logEntries from '../logEntries.js';
import logEntry from '../logEntry.js';
import { mockDriver, mockRawEntryGenerator, mockEntryGenerator } from '../mocks/mocks';

describe( 'logEntries module', () => {

  describe('raw entries', () => {

    beforeAll( () => {
      mockDriver.setEntries({ entries: [
        mockRawEntryGenerator({ message: {
          method: "Network.requestWillBeSent",
          params: {
            request: {
              url: "www/testurl1?testparam1=1&testparam2=2"
            }
          }
        }}),
      ] });
    });

    describe('getRawEntries', () => {
      it('it is defined', () => {
        expect(logEntries.getRawEntries).toBeDefined();
      });

      it('it needs a driver instance', () => {
        expect(logEntries.getRawEntries).toThrow();
        let fakeCall = () => {
          logEntries.getRawEntries({
            driver : mockDriver
          });
        }
        expect(fakeCall).not.toThrow();
      });

      it('calls driver.manage().logs().get() with `performance` type', () => {
        spyOn(mockDriver.manage().logs(), 'get').and.callThrough();

        return logEntries.getRawEntries({driver : mockDriver})
        .then( () => {
          expect(mockDriver.manage().logs().get).toHaveBeenCalledWith('performance');
        });
      });

      it('returns the result of driver.manage().logs().get()', () => {
        return logEntries.getRawEntries({driver : mockDriver})
        .then( () => {
          expect(logEntries.getRawEntries({driver : mockDriver})).toEqual(mockDriver.manage().logs().get('performance'));
        });
      });

      it('gives back an array', () => {
        return logEntries.getRawEntries({driver : mockDriver})
        .then( (entries) => {
          expect({}.toString.call(entries)).toEqual('[object Array]');
        });
      });

      it('an entry has a toJSON function', () => {
        return logEntries.getRawEntries({driver : mockDriver})
        .then( (entries) => {
          expect(typeof entries[0].toJSON).toEqual('function');
        });
      });
    });
  });

  describe('filterByMethod', () => {
  let entries;

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
      let filteredEntries = logEntries.filterByMethod({ entries, method }).filteredEntries;
      expect(filteredEntries.length).toEqual(1);
   });

  });

  describe('entriesByUrlPart', () => {
    let entries;

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
      expect(logEntries.filterByUrlPart( { entries, urlPart: 'testurl1'}).filteredEntries.length).toEqual(2);
    });
  });

  describe('filters can be chained', () => {
    let entries;

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
      let filteredChainResult = logEntries
        .filterByMethod( { entries, method: 'Network.requestWillBeSent'})
        .filterByUrlPart( { urlPart: 'testurl1'});
      let filteredEntries = filteredChainResult.filteredEntries;
      expect(filteredEntries.length).toEqual(1);
      expect(filteredEntries[0].message.fakeProperty).toEqual('fakeData');
      expect(typeof filteredChainResult.filterByMethod).toEqual('function');
      expect(typeof filteredChainResult.filterByUrlPart).toEqual('function');
    });
  });
});
