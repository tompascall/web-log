import weblog from '../weblog';
jest.unmock('../weblog');

describe('weblog', () => {

  const mockEntries = [
    {
      message: {},
      toJSON () {
        return {
          message: JSON.stringify( { message:this.message })
        }
      }
    }
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
        weblog.checkDriver();
      };
      let fakeCallWithDriver = () => {
        weblog.checkDriver({ driver: mockDriver});
      };

      expect(fakeCallWithoutDriver).toThrow();
      expect(fakeCallWithDriver).not.toThrow();
    });
  });
  
  describe('getRawEntries', () => {
    it('it is defined', () => {
      expect(weblog.getRawEntries).toBeDefined();
    });

    it('it needs a driver instance', () => {
      expect(weblog.getRawEntries).toThrow();
      let fakeCall = () => {
        weblog.getRawEntries({
          driver : mockDriver 
        });
      }
      expect(fakeCall).not.toThrow();
    });
    
    it('calls driver.manage().logs().get() with `performance` type', () => {
      spyOn(mockDriver.manage().logs(), 'get').and.callThrough();

      return weblog.getRawEntries({driver : mockDriver})
      .then( () => {
        expect(mockDriver.manage().logs().get).toHaveBeenCalledWith('performance');
      });
    });

    it('returns the result of driver.manage().logs().get()', () => {
      return weblog.getRawEntries({driver : mockDriver})
      .then( () => {
        expect(weblog.getRawEntries({driver : mockDriver})).toEqual(mockDriver.manage().logs().get('performance'));
      });
    });

    it('gives back an array', () => {
      return weblog.getRawEntries({driver : mockDriver})
      .then( (entries) => {
        expect({}.toString.call(entries)).toEqual('[object Array]');
      });
    });

    it('an entry has a toJSON function', () => {
      return weblog.getRawEntries({driver : mockDriver})
      .then( (entries) => {
        expect(typeof entries[0].toJSON).toEqual('function');
      });
    });

    it('an entry has a message propery', () => {
      return weblog.getRawEntries({driver : mockDriver})
      .then( (entries) => {
        expect(typeof entries[0].message).toBeDefined;
      });
    });
  });

  describe('getEntryMessage', () => {
    let mockEntry, entries;

    beforeEach( () => {
      return weblog.getRawEntries({driver : mockDriver})
      .then( (result) => {
        entries = result;
        mockEntry = entries[0];
      });
    });

    it('calls the mockEntry toJSON function', () => {
      spyOn(mockEntry, 'toJSON').and.callThrough();
      weblog.getEntryMessage(mockEntry);
      expect(mockEntry.toJSON).toHaveBeenCalled();
    });

    it('returns the JSON parsed message property of the toJSON function call', () => {
      let message = weblog.getEntryMessage(mockEntry);
      expect(message).toEqual({ message: mockEntry.message});
    });

  });

});
