import logEntries from '../src/logentries';
const driver = require('../driver/driver')
	.createDriver({type: 'chrome'});

driver.get('http://google.com')
.then( () => {
	return logEntries.getLogEntries({driver});
})
.then( (entriesMessages) => {
	console.log('ENTRIES',JSON.stringify(entriesMessages));
	driver.quit();
})

