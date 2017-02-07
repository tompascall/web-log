import driverUtil from '../driver';
import webdriver from 'selenium-webdriver';

describe('driver', () => {

  describe('createDriver', () => {
    it('throws error if type is not given', () => {
      expect(driverUtil.createDriver).toThrow();
    });

    it('should call getDriver with type and options', () => {
      spyOn(driverUtil, 'getDriver');
      driverUtil.createDriver({ type: 'chrome'});
      expect(driverUtil.getDriver).toHaveBeenCalled();
    });
  });

  describe('getDriver', () => {
    it('should call webdriver.Builder', () => {
      spyOn(webdriver, 'Builder').and.callFake( () => {
        return {
          forBrowser () {
            return {
              withCapabilities () {
                return {
                  build () {}
                }
              }
            }
          }
        }
      });

      driverUtil.getDriver({
        type: 'chrome',
        options: {
          toCapabilities () {}
        }
      });
      expect(webdriver.Builder).toHaveBeenCalled();
    });
  });
  describe('checkDriver', () => {
    it('throws error if driver is not given as param', () => {
      expect(driverUtil.checkDriver).toThrow();
    });

    it('throws error if driver is not set up properly', () => {
      let fakeCall = () => {
        driverUtil.checkDriver({ driver: {} });
      }
      expect(fakeCall).toThrow();
    });

    it('checks driver by ducktype', () => {
      let fakeCallWithoutGetFunction = () => {
        driverUtil.checkDriver({
          driver: {
            manage () {
              return {
                logs () {
                  return {}
                }
              }
            }
          }
        });
      }

      let fakeCallWithGetFunction = () => {
        driverUtil.checkDriver({
          driver: {
            manage () {
              return {
                logs () {
                  return {
                    get () {}
                  }
                }
              }
            }
          }
        });
      }
      expect(fakeCallWithoutGetFunction).toThrow();
      expect(fakeCallWithGetFunction).not.toThrow();
    });
  });
});
