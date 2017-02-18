const { driverUtil, logEntries } = require('../src/web-log');

const driver = driverUtil.createDriver({type: 'chrome'});

driver.get('https://search.yahoo.com/')
.then( () => {
	return logEntries.getLogEntries({driver});
})
.then( (entriesMessages) => {
  let filteredEntries = logEntries.filterEntries({entries: entriesMessages, urlPart: 'images/ff_icon-compressed.png', method: 'Network.requestWillBeSent'});
	console.log('ENTRIES',JSON.stringify(filteredEntries));
	driver.quit();
})

