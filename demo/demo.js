import { logEntries, driver as driverUtil } from '../src/weblog';

const driver = driverUtil.createDriver({type: 'chrome'});

driver.get('https://search.yahoo.com/')
.then( () => {
	return logEntries.getLogEntries({driver});
})
.then( (entriesMessages) => {
  let matchedEntries = logEntries.filterEntries({entries: entriesMessages, urlPart: 'images/ff_icon-compressed.png', method: 'Network.requestWillBeSent'});
	console.log('ENTRIES',JSON.stringify(matchedEntries));
	driver.quit();
})

