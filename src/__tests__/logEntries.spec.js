const logEntries = require('../logEntries');
const logEntry = require('../logEntry');
const { mockDriver, mockRawEntryGenerator, mockEntryGenerator } = require('../mocks/mocks');

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
      it('is defined', () => {
        expect(logEntries.getRawEntries).toBeDefined();
      });

      it('needs a driver instance', () => {
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

      it('has a toJSON function', () => {
        return logEntries.getRawEntries({driver : mockDriver})
        .then( (entries) => {
          expect(typeof entries[0].toJSON).toEqual('function');
        });
      });
    });
  });

  describe('getLogEntries', () => {
    it('should call getRawEntries', () => {
      spyOn(logEntries, 'getRawEntries').and.callFake( () => {
        return Promise.resolve([]);
      });
      return logEntries.getLogEntries()
        .then( () => {
          expect(logEntries.getRawEntries).toHaveBeenCalled();
        });
    });

    it('should map rawEntries by logEntry.entryMessageFromRawEntry()', () => {
      spyOn(logEntries, 'getRawEntries')
        .and.callFake( () => {
          return Promise.resolve([{}, {}]);
        });
      spyOn(logEntry, 'entryMessageFromRawEntry');
      return logEntries.getLogEntries()
        .then( () => {
          expect(logEntry.entryMessageFromRawEntry).toHaveBeenCalledTimes(2);
        });
    });
  });

  describe('clearEntries', () => {
      it('calls getLogEntries with driver to clear entries', () => {
          spyOn(logEntries, 'getLogEntries').and.callFake( () => Promise.resolve());
          return logEntries.clearLogEntries({ driver: mockDriver })
            .then( () => {
                expect(logEntries.getLogEntries).toHaveBeenCalledWith({ driver: mockDriver });
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

  describe('filterByStatus', () => {
    let entries;

    beforeAll( () => {
      entries = [
        mockEntryGenerator({
          method: "Network.requestWillBeSent",
          url: "www/testurl1?testparam1=1&testparam2=2",
        }),
        mockEntryGenerator({
          method: "Network.requestWillBeSent",
          url: "www/testurl3?testparam1=1&testparam2=2",
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl1?testparam1=1&testparam2=2",
          status: '200'
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl3?testparam1=1&testparam2=2",
          status: '404'
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl2?testparam1=1&testparam2=2",
          status: '403'
        }),
      ]
    });

    it('should give back entries as are if status is not given', () => {
      const filteredEntries = logEntries.filterByStatus({entries}).filteredEntries;
      expect(filteredEntries).toEqual(entries);
    });

    it('should filter by status as regex', () => {
      let filteredEntries = logEntries.filterByStatus({entries, status: /2\d\d/}).filteredEntries;
      expect(filteredEntries).toEqual([ entries[2] ]);

      filteredEntries = logEntries.filterByStatus({entries, status: /40[34]/}).filteredEntries;
      expect(filteredEntries).toEqual([ entries[3],entries[4] ]);
    });

    it('should filter by status as string', () => {
      let filteredEntries = logEntries.filterByStatus({entries, status: '403'}).filteredEntries;
      expect(filteredEntries).toEqual([ entries[4] ]);

      filteredEntries = logEntries.filterByStatus({entries, status: /40[34]/}).filteredEntries;
      expect(filteredEntries).toEqual([ entries[3],entries[4] ]);
    });
  });

  describe('filterByPredicate', () => {
    let entries;

    beforeAll( () => {
      entries = [
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl1?testparam1=1&testparam2=2",
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl3?testparam3=3&testparam4=4",
        }),
      ]
    });

    it('gives back all entries if predicate is not given', () => {
      let filteredEntries = logEntries
        .filterByPredicate( { entries })
        .filteredEntries;

      expect(filteredEntries).toEqual(entries);
    });

    it('filters by any predicate', () => {
      let filteredEntries = logEntries
        .filterByPredicate({
          entries,
          predicate: entry => {
            let method = logEntry.getMethod({ entry });
            let url = logEntry.getUrl({ entry });
            return method.split('.')[1] + '--' + url.split('?')[0] === 'responseReceived--www/testurl3';
          }
        })
        .filteredEntries;

      expect(filteredEntries).toEqual([ entries[1] ]);
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

    it('can be chained', () => {
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

  describe('filterEntries', () => {
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
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl2?testparam1=1&testparam2=2",
          status: '200'
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl4?testparam1=1&testparam2=2",
          status: '200'
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/testurl4?testparam1=1&testparam2=2",
          status: '302'
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/duplicated?testparam5=5&testparam6=6",
          status: '400'
        }),
        mockEntryGenerator({
          method: "Network.responseReceived",
          url: "www/duplicated?testparam5=5&testparam6=6",
          status: '400'
        }),
      ]
    });

    it('should give back an empty array if no args given', () => {
      // action means here a log with a given method and url and matched params
      let matched = logEntries.filterEntries();
      expect(matched).toBeFalsy();
    });

    it('should give back an empty array if no match in actons of entries', () => {
      // action means here a log with a given method and url and matched params
      let matched = logEntries.filterEntries({ entries, method: 'fakeMethod', urlPart: 'fakeUrl'});
      expect(matched).toBeFalsy();
    });

    it('should give back an array with matched entries with the same method', () => {
      let matched = logEntries.filterEntries({ entries, method: 'Network.requestWillBeSent'});
      expect(matched).toEqual([ entries[0], entries[1] ]);

    });

    it('should give back an array with matched entries with the same urlPart (no method checking)', () => {
      let matched = logEntries.filterEntries({ entries, urlPart: 'www/testurl1?testparam1='});
      expect(matched).toEqual([ entries[0], entries[2] ]);

    });

    it('should be able to combine filter types', () => {
      let matched = logEntries.filterEntries({ entries, urlPart: 'www/testurl1?testparam1=', method: 'Network.requestWillBeSent' });
      expect(matched).toEqual([ entries[0] ]);
    });

    it('should filter query params as well', () => {
      let matched = logEntries.filterEntries({ entries, refParams: {testparam3: '3', testparam4: '4'} });
      expect(matched).toEqual([ entries[1] ]);

    });

    it('should filter status as well', () => {
      let matched = logEntries.filterEntries({ entries, urlPart: 'www/testurl4', status: '200' });
      expect(matched).toEqual([ entries[4] ]);

    });

    it('should filter predicate as well', () => {
      let matched = logEntries.filterEntries({
        entries,
        urlPart: 'www/testurl4',
        predicate: entry => {
          let status = logEntry.getStatus({ entry });
          return +status === 302;
        }
      });
      expect(matched).toEqual([ entries[5] ]);

    });

    it('should throw error if dupAlert option is set to true and there are duplications', () => {
      let params = {
        entries,
        urlPart: 'duplicated'
      };

      function getMatchedWithoutError () {
        return logEntries.filterEntries(params);
      }

      function getMatchedWithError () {
        return logEntries.filterEntries(Object.assign(params, { dupAlert: true}));
      }

      expect(getMatchedWithoutError()).toEqual([ entries[6], entries[7] ]);
      expect(getMatchedWithError).toThrow();
    });
  });
});
