import mapMethodToAction from './mapMethodToAction';
import { checkDriver } from '../driver/driver';
import logEntry from './logEntry';
import utils from './utils';
import { matches } from 'lodash';

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

  filterByUrlPart ({ entries, urlPart = '' } = {}) {
    if (!urlPart) {
      return Object.assign({}, this, {
        filteredEntries: entries || this.filteredEntries
      });
    }
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

  filterByRefParams ({ entries, refParams } = {}) {
    if (!refParams) {
      return Object.assign({}, this, {
        filteredEntries: entries || this.filteredEntries
      });
    }

    let filteredEntries = (
      entries || this.filteredEntries || []
    )
    .filter( (entry) => {
      let parsedQuery = utils.getParsedQuery({
        url: logEntry.getUrl({ entry }) 
      });
      return matches(refParams)(parsedQuery);
    });

    return Object.assign({}, this, {
      filteredEntries
    });

  },

  matchAction ({entries = [], method, urlPart, refParams} = {}) {
    let matched = this.filterByMethod({ entries, method })
      .filterByUrlPart({ urlPart })
      .filterByRefParams({ refParams })
      .filteredEntries;
    if (matched.length) {
      return matched;
    }
    return false;
  }
};

export default logEntries;
