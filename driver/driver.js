const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome');

function getChromeDriverOptions () {
  let options = new chrome.Options();
  let logging_prefs = new webdriver.logging.Preferences();
  logging_prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.INFO);
  options.setLoggingPrefs(logging_prefs);
  return options;
}

function getDriver (type) {
  let options;
  switch (type) {
    case 'chrome':
      options = getChromeDriverOptions();
    break;
    default:
      throw Error('unknown webdriver type');
  }

  return new webdriver.Builder()
    .forBrowser(type)
    .withCapabilities(options.toCapabilities())
    .build();
}

module.exports = {
  createDriver ({ type } = {}) {
    return getDriver(type);
  }
};
