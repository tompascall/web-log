import driver from '../driver';
import webdriver from 'selenium-webdriver';

describe('driver', () => {

  describe('createDriver', () => {
    it('throws error if type is not given', () => {
      expect(driver.createDriver).toThrow();
    });  

    it('should call getDriver with type and options', () => {
      spyOn(driver, 'getDriver');
      driver.createDriver({ type: 'chrome'});
      expect(driver.getDriver).toHaveBeenCalled();
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

      driver.getDriver({
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
      expect(driver.checkDriver).toThrow();
    });

    it('throws error if driver is not set up properly', () => {
      let fakeCall = () => {
        driver.checkDriver({ driver: {} });
      }
      expect(fakeCall).toThrow();
    });

    it('checks driver by ducktype', () => {
      let fakeCallWithoutGetFunction = () => {
        driver.checkDriver({
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
        driver.checkDriver({
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
