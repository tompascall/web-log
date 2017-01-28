const driver = require('../driver/driver')
	.createDriver({type: 'chrome'});

function getEntries (driver) {
	return driver.manage().logs().get('performance')
}

function getEntryMessage (entry) {
	return JSON.parse(entry.toJSON().message);
}

driver.get('http://google.com')
.then( () => {
	return getEntries(driver);
})
.then( (entries) => {
	return entries.map(getEntryMessage);
})
.then( (entriesMessages) => {
	console.log(JSON.stringify(entriesMessages));
	driver.quit();
})

