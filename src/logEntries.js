import mapMethodToAction from './mapMethodToAction';
import driverUtil from '../driver/driver';
import logEntry from './logEntry';
import utils from './utils';
import { matches } from 'lodash';

const logEntries = {

  /* ********************
   * raw log data
   * ********************/

  getRawEntries ({ driver } = {}) {
    driverUtil.checkDriver({ driver });
    return driver.manage().logs().get('performance');
  },

  /* ********************
   * transformed log data
   * ********************/

  getLogEntries ({ driver } = {}) {
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
        filteredEntries: entries || this.filteredEntries
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

  getCurrentEntries ({ entries }) {
    return entries || this.filteredEntries;
  },

  getChainableClone ({ filteredEntries, predicate }) {
    let clone = Object.assign({}, this, {
      filteredEntries
    });
    if (predicate) {
      clone.filteredEntries = clone.filteredEntries.filter(predicate);
    }
    return clone;
  },
  
  filterByUrlPart ({ entries, urlPart = '' } = {}) {
    const currentEntries = this.getCurrentEntries({ entries });
    let predicate;

    if (urlPart) {
      predicate = entry => logEntry.matchUrlPart({ entry, urlPart });
    }

    return this.getChainableClone({ filteredEntries: currentEntries, predicate });
  },

  filterByRefParams ({ entries, refParams } = {}) {
    const currentEntries = this.getCurrentEntries({ entries });
    let predicate;

    if (refParams) {
      predicate = entry => {
        let parsedQuery = utils.getParsedQuery({
          url: logEntry.getUrl({ entry }) 
        });
        return matches(refParams)(parsedQuery);
      }
    }
    return this.getChainableClone({ filteredEntries: currentEntries, predicate });
  },

  filterByStatus ({ entries, status } = {}) {
    if (!status) {
      return Object.assign({}, this, {
        filteredEntries: entries || this.filteredEntries
      });
    }

    let filteredEntries = (
      entries || this.filteredEntries || []
    )
    .filter( (entry) => {
      return logEntry.matchStatus({ entry, status });
    });

    return Object.assign({}, this, {
      filteredEntries
    });
  },

  filterEntries ({
    entries = [],
    method,
    urlPart,
    refParams,
    status
  } = {}) {
    let matched = this.filterByMethod({ entries, method })
      .filterByUrlPart({ urlPart })
      .filterByRefParams({ refParams })
      .filterByStatus({ status })
      .filteredEntries;
    if (matched.length) {
      return matched;
    }
    return false;
  }
};

export default logEntries;
