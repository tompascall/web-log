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

  filterByPredicate ({ entries, predicate }) {
    let clone = Object.assign({}, this, {
      filteredEntries: entries || this.filteredEntries
    });
    if (predicate) {
      clone.filteredEntries = clone.filteredEntries.filter(predicate);
    }
    return clone;
  },

  filterByMethod ({entries, method} = {}) {
    let predicate;
    if (method) {
      predicate = entry => entry.message.method === method;
    }
    return this.filterByPredicate({ entries, predicate });
  },

  filterByUrlPart ({ entries, urlPart = '' } = {}) {
    let predicate;
    if (urlPart) {
      predicate = entry => logEntry.matchUrlPart({ entry, urlPart });
    }
    return this.filterByPredicate({ entries, predicate });
  },

  filterByRefParams ({ entries, refParams } = {}) {
    let predicate;
    if (refParams) {
      predicate = entry => {
        let parsedQuery = utils.getParsedQuery({
          url: logEntry.getUrl({ entry })
        });
        return matches(refParams)(parsedQuery);
      }
    }
    return this.filterByPredicate({ entries, predicate });
  },

  filterByStatus ({ entries, status } = {}) {
    let predicate;
    if (status) {
      predicate = entry => logEntry.matchStatus({ entry, status });
    }
    return this.filterByPredicate({ entries, predicate });
  },

  filterEntries ({
    entries = [],
    method,
    urlPart,
    refParams,
    status,
    predicate
  } = {}) {
    let matched = this.filterByMethod({ entries, method })
      .filterByUrlPart({ urlPart })
      .filterByRefParams({ refParams })
      .filterByStatus({ status })
      .filterByPredicate({ predicate })
      .filteredEntries;
    if (matched.length) {
      return matched;
    }
    return false;
  }
};

export default logEntries;
