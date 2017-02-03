//const weblog = require('../src/weblog');
import get from '../src/get.js';
const driver = require('../driver/driver')
	.createDriver({type: 'chrome'});

driver.get('http://google.com')
.then( () => {
	return get.entries({driver});
})
.then( (entriesMessages) => {
	console.log('ENTRIES',JSON.stringify(entriesMessages));
	driver.quit();
})

