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

    it('gives back entries if no method is given', () => {
      let filteredEntries = logEntries.filterByMethod({ entries}).filteredEntries;
      expect(filteredEntries.length).toEqual(2);

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
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl2?testparam1=1&testparam2=2"
        })
      ]
    });

    it('gives back entries if no urlPart is given', () => {
      expect(logEntries.filterByUrlPart( { entries }).filteredEntries.length).toEqual(3);
    });

    it('filters entries by urlPart', () => {
      expect(logEntries.filterByUrlPart( { entries, urlPart: 'testurl1'}).filteredEntries.length).toEqual(2);
    });
  });

  describe('filterByRefParams', () => {
    let entries;

    beforeAll( () => {
      entries = [
        mockEntryGenerator({
          method: "Network.requestWillBeSent",
          url: "www/testurl1?testparam1=1&testparam2=2",
        }),
        mockEntryGenerator({
          method: "Network.requestWillBeSent",
          url: "www/testurl3?testparam3=3&testparam4=4",
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl1?testparam1=1&testparam2=2"
        }),
      ]
    });

    it('gives back all entries if refParams not given', () => {
      let filteredEntries = logEntries
        .filterByRefParams( { entries })
        .filteredEntries;

      expect(filteredEntries).toEqual(entries);
    });

    it('filters by refParams', () => {
      let filteredEntries = logEntries
        .filterByRefParams({
          entries,
          refParams: {testparam1: '1', testparam2: '2'}
        })
        .filteredEntries;

      expect(filteredEntries).toEqual([ entries[0], entries[2] ]);
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

  describe('match action', () => {
    let entries;
    beforeAll( () => {
      entries = [
        mockEntryGenerator({
          method: "Network.requestWillBeSent",
          url: "www/testurl1?testparam1=1&testparam2=2",
        }),
        mockEntryGenerator({
          method: "Network.requestWillBeSent",
          url: "www/testurl3?testparam3=3&testparam4=4",
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl1?testparam1=1&testparam2=2"
        }),
      ]
    });

    it('should give back an empty array if no args given', () => {
      // action means here a log with a given method and url and matched params
      let matched = logEntries.matchAction();
      expect(matched).toBeFalsy();
    });

    it('should give back an empty array if no match in actons of entries', () => {
      // action means here a log with a given method and url and matched params
      let matched = logEntries.matchAction({ entries, method: 'fakeMethod', urlPart: 'fakeUrl'});
      expect(matched).toBeFalsy();
    });

    it('should give back an array with matched entries with the same method', () => {
      let matched = logEntries.matchAction({ entries, method: 'Network.requestWillBeSent'});
      expect(matched).toEqual([ entries[0], entries[1] ]);

    });

    it('should give back an array with matched entries with the same urlPart (no method checking)', () => {
      let matched = logEntries.matchAction({ entries, urlPart: 'www/testurl1?testparam1='});
      expect(matched).toEqual([ entries[0], entries[2] ]);

    });

    it('urlPart and method checking can be combined', () => {
      let matched = logEntries.matchAction({ entries, urlPart: 'www/testurl1?testparam1=', method: 'Network.requestWillBeSent' });
      expect(matched).toEqual([ entries[0] ]);
    });

    it('should be check query params as well', () => {
      let matched = logEntries.matchAction({ entries, refParams: {testparam3: '3', testparam4: '4'} });
      expect(matched).toEqual([ entries[1] ]);

    });
  });
});
