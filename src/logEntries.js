const mapMethodToAction = require('./mapMethodToAction');
const driverUtil = require('../driver/driver');
const logEntry = require('./logEntry');
const utils = require('./utils');
const { matches } = require('lodash');
const { fgRed, fgGreen, fgYellow, reset } = utils.logColors;

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

  clearLogEntries ({ driver } = {}) {
    return this.getLogEntries({ driver });
  },

  getRequests ({ entries }) {
      return entries.filter(entry => entry.message.params.request).map( entry => entry.message.params.request);
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
    predicate,
    dupAlert
  } = {}) {
    let matched = this.filterByMethod({ entries, method })
      .filterByUrlPart({ urlPart })
      .filterByRefParams({ refParams })
      .filterByStatus({ status })
      .filterByPredicate({ predicate })
      .filteredEntries;

    if (matched.length) {
      if (!dupAlert) return matched;

      if (matched.length > 1) {
        throw new Error(this.getDuplicationAlertMessage({
          args: arguments[0],
          matched
        }));
      }
    }
    return false;
  },

  getDuplicationAlertMessage({ args, matched } = {}) {
    let optionsMessage = this.getOptionsMessage({ params: args });
    return (`
${fgRed}There are duplications in filtered entries:${reset}

${fgYellow}Filtered Entries:${reset}
${JSON.stringify(matched)}

${fgYellow}Filter options:${reset}
${optionsMessage}
`)
  },

  getOptionsMessage ({ params } = {}) {
    let filledFilterParams = [];
    for (let paramKey in params) {
      if (params[paramKey] && paramKey !== 'entries') {
        filledFilterParams.push({
          name: paramKey,
          value: params[paramKey]
        });
      }
    }
    let optionsMessage = '';
    filledFilterParams.forEach( param => {
      optionsMessage += `- ${param.name}: ${param.value}\n`;
    });
    return optionsMessage;
  }
};

module.exports = logEntries;
