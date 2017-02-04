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
    // we let flow through data if no method
    // for chainability
    if (!method) {
      return Object.assign({}, this, {
        filteredEntries: entries
      });
    }
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
  },

  matchAction ({entries = [], method, urlPart} = {}) {
    let matched = this.filterByMethod({ entries, method })
      .filterByUrlPart({ urlPart })
      .filteredEntries;
    if (matched.length) {
      return matched;
    }
    return false;
  }
};

export default logEntries;
