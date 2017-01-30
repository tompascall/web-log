import weblog from '../weblog';
import get from '../get';
import filter from '../filter.js';
jest.unmock('../weblog');
jest.unmock('../get');
jest.unmock('../filter');

describe('weblog', () => {
  const mockEntryGenerator = function ({ message } = {}) {
    return {
      message,
      toJSON () {
        return {
          message: JSON.stringify( { message:this.message })
        }
      }
    };
  };

  const mockEntries = [
    mockEntryGenerator({ message: {
      method: "Network.requestWillBeSent",
      params: {
        request: {
          url: "www/testurl1?testparam1=1&testparam2=2"
        }
      }
    }}),
    mockEntryGenerator({message: {
      method: "fakeMethod",
      params: {
        request: {
          url: "www/testurl1?testparam1=1&testparam2=2"
        }
      }
    }}),
  ];

  const mockDriver = {
    manage () { return this },
    logs () { return this },
    get (logType) {
      if (logType === 'performance') {
        return Promise.resolve(mockEntries);
      }
    }
  };

  it('weblog is an object', () => {
    expect({}.toString.call(weblog)).toBe('[object Object]');
  });

  describe('checkDriver', () => {
    it('should throw err if not driver given or not set up properly', () => {
      let fakeCallWithoutDriver = () => {
       get.checkDriver();
      };
      let fakeCallWithDriver = () => {
        get.checkDriver({ driver: mockDriver});
      };

      expect(fakeCallWithoutDriver).toThrow();
      expect(fakeCallWithDriver).not.toThrow();
    });
  });

  describe('getRawEntries', () => {
    it('it is defined', () => {
      expect(get.getRawEntries).toBeDefined();
    });

    it('it needs a driver instance', () => {
      expect(get.getRawEntries).toThrow();
      let fakeCall = () => {
        get.getRawEntries({
          driver : mockDriver
        });
      }
      expect(fakeCall).not.toThrow();
    });

    it('calls driver.manage().logs().get() with `performance` type', () => {
      spyOn(mockDriver.manage().logs(), 'get').and.callThrough();

      return get.getRawEntries({driver : mockDriver})
      .then( () => {
        expect(mockDriver.manage().logs().get).toHaveBeenCalledWith('performance');
      });
    });

    it('returns the result of driver.manage().logs().get()', () => {
      return get.getRawEntries({driver : mockDriver})
      .then( () => {
        expect(get.getRawEntries({driver : mockDriver})).toEqual(mockDriver.manage().logs().get('performance'));
      });
    });

    it('gives back an array', () => {
      return get.getRawEntries({driver : mockDriver})
      .then( (entries) => {
        expect({}.toString.call(entries)).toEqual('[object Array]');
      });
    });

    it('an entry has a toJSON function', () => {
      return get.getRawEntries({driver : mockDriver})
      .then( (entries) => {
        expect(typeof entries[0].toJSON).toEqual('function');
      });
    });
  });

  describe('getStringifiedEntryMessage', () => {
    let mockEntry, entries;

    beforeEach( () => {
      return get.getRawEntries({driver : mockDriver})
      .then( (result) => {
        entries = result;
        mockEntry = entries[0];
      });
    });

    it('calls the mockEntry toJSON function', () => {
      spyOn(mockEntry, 'toJSON').and.callThrough();
      get.getStringifiedEntryMessage(mockEntry);
      expect(mockEntry.toJSON).toHaveBeenCalled();
    });

    it('gives back a parseable stringified object', () => {
      let message = get.getStringifiedEntryMessage(mockEntry);
      let parseMessage = function () {
        return JSON.parse(message);
      };
      expect(parseMessage).not.toThrow();
    });

  });

  describe('getEntryMessage', () => {
    let mockEntry, entries;

    beforeEach( () => {
      return get.getRawEntries({driver : mockDriver})
      .then( (result) => {
        entries = result;
        mockEntry = entries[0];
      });
    });

    it('returns the JSON parsed message property of the toJSON function call', () => {
      let message = get.getEntryMessage(mockEntry);
      expect(message).toEqual({ message: mockEntry.message});
    });
  });

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
});
