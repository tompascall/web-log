import get from '../get';
import mockDriver from '../mocks/mocks';

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

describe('rawEntries', () => {
  it('it is defined', () => {
    expect(get.rawEntries).toBeDefined();
  });

  it('it needs a driver instance', () => {
    expect(get.rawEntries).toThrow();
    let fakeCall = () => {
      get.rawEntries({
        driver : mockDriver
      });
    }
    expect(fakeCall).not.toThrow();
  });

  it('calls driver.manage().logs().get() with `performance` type', () => {
    spyOn(mockDriver.manage().logs(), 'get').and.callThrough();

    return get.rawEntries({driver : mockDriver})
    .then( () => {
      expect(mockDriver.manage().logs().get).toHaveBeenCalledWith('performance');
    });
  });

  it('returns the result of driver.manage().logs().get()', () => {
    return get.rawEntries({driver : mockDriver})
    .then( () => {
      expect(get.rawEntries({driver : mockDriver})).toEqual(mockDriver.manage().logs().get('performance'));
    });
  });

  it('gives back an array', () => {
    return get.rawEntries({driver : mockDriver})
    .then( (entries) => {
      expect({}.toString.call(entries)).toEqual('[object Array]');
    });
  });

  it('an entry has a toJSON function', () => {
    return get.rawEntries({driver : mockDriver})
    .then( (entries) => {
      expect(typeof entries[0].toJSON).toEqual('function');
    });
  });
});

describe('stringifiedEntryMessage', () => {
  let mockEntry, entries;

  beforeEach( () => {
    return get.rawEntries({driver : mockDriver})
    .then( (result) => {
      entries = result;
      mockEntry = entries[0];
    });
  });

  it('calls the mockEntry toJSON function', () => {
    spyOn(mockEntry, 'toJSON').and.callThrough();
    get.stringifiedEntryMessage(mockEntry);
    expect(mockEntry.toJSON).toHaveBeenCalled();
  });

  it('gives back a parseable stringified object', () => {
    let message = get.stringifiedEntryMessage(mockEntry);
    let parseMessage = function () {
      return JSON.parse(message);
    };
    expect(parseMessage).not.toThrow();
  });

});

describe('entryMessage', () => {
  let mockEntry, entries;

  beforeAll( () => {
    return get.rawEntries({driver : mockDriver})
    .then( (result) => {
      entries = result;
      mockEntry = entries[0];
    });
  });

  it('returns the JSON parsed message property of the toJSON function call', () => {
    let message = get.entryMessage(mockEntry);
    expect(message).toEqual({ message: mockEntry.message});
  });
});

describe('entries', () => {
  let rawEntries;

  beforeAll( () => {
    return get.rawEntries({driver : mockDriver})
    .then( (result) => {
      rawEntries = result;
    });
  });

  it('extracts entry message from rawEntries', () => {
    return get.entries({ driver: mockDriver })
    .then( (entries) => {
      expect(entries.length).toEqual(rawEntries.length);
      entries.forEach( (entry, index) => {
        expect(entry).toEqual(get.entryMessage(rawEntries[index]));
      });
    });  
  });
});
