import weblog from '../weblog';
jest.unmock('../weblog');

describe('weblog', () => {

  const mockDriver = {
    manage () { return this },
    logs () { return this },
    get () {return this }
  };

  it('it is an object', () => {
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
    
    it('it gives back a thenable', () => {
      expect(typeof weblog.getRawEntries({driver : mockDriver}).then).toEqual('function');
    });
  });

});
