import mapMethodToAction from './mapMethodToAction';

const logEntry = {
  getStringifiedEntryMessageFromRawEntry (rawEntry) {
    return rawEntry.toJSON().message;
  },

  entryMessageFromRawEntry (rawEntry) {
    return JSON.parse(this.getStringifiedEntryMessageFromRawEntry(rawEntry));
  },

  getMethod ({ entry } = {}) {
    return entry.message.method;
  },

  matchUrlPart ({ entry, urlPart = '' } = {}) {
    let method = this.getMethod({ entry });
    return entry.message.params[mapMethodToAction[method]] &&
      entry.message.params[mapMethodToAction[method]].url.search(urlPart) > -1;
  },
};

export default logEntry;
