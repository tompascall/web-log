import mapMethodToAction from './mapMethodToAction';
import { checkDriver } from '../driver/driver';
import logEntry from './logEntry';
const logEntries = {

  /* ********************
   * raw log data
   * ********************/

  getRawEntries ({ driver } = {}) {
    checkDriver({ driver });
    return driver.manage().logs().get('performance');
  },

  /* ********************
   * transformed log data
   * ********************/

  getLogEntries ({ driver }) {
    return this.getRawEntries({ driver })
    .then( (rawEntries) => {
      return rawEntries.map( (rawEntry) => {
        return logEntry.entryMessageFromRawEntry(rawEntry);
      });
    });
  },

	filterByMethod ({entries, method} = {}) {
    let filteredEntries = (
      entries || this.filteredEntries || []
    ).filter( (entry) => {
      return entry.message.method === method;
    });

    return Object.assign({}, this, {
      filteredEntries
    });
  },

  filterByUrlPart ({ entries, urlPart = '' } = {}) {
    let filteredEntries = (
      entries || this.filteredEntries || []
    )
    .filter( (entry) => {
      return logEntry.matchUrlPart({ entry, urlPart });
    });

    return Object.assign({}, this, {
      filteredEntries
    });
  }
};

export default logEntries;
