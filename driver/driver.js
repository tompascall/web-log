const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome');

function getChromeDriverOptions () {
  let options = new chrome.Options();
  let logging_prefs = new webdriver.logging.Preferences();
  logging_prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.INFO);
  options.setLoggingPrefs(logging_prefs);
  return options;
}

const driverUtil = {
  getDriver ({ type, options } = {}) {
    return new webdriver.Builder()
      .forBrowser(type)
      .withCapabilities(options.toCapabilities())
      .build();
  },

  createDriver ({ type } = {}) {
    let options;
    switch (type) {
      case 'chrome':
        options = getChromeDriverOptions();
      break;
      default:
        throw Error('unknown type of webdriver');
    }
    return this.getDriver({ type, options });
  },

  checkDriver ({ driver } = {}) {
    if (!driver) {
      throw Error('You have to give a driver instance as named param');
    }
    try {
      if (typeof driver.manage().logs().get !== 'function') {
        throw Error();
      }
    }
    catch (e) {
      throw Error('driver has not been set up properly, cannot log network traffic');
    }
  },
};

module.exports = driverUtil;

