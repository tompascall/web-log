import mapMethodToAction from './mapMethodToAction';
import { escapeRegExp } from 'lodash';

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

  getUrl ({ entry }) {
    let method = this.getMethod({ entry });
    return entry.message.params[mapMethodToAction[method]].url;
  },

  matchUrlPart ({ entry, urlPart = '' } = {}) {
    let method = this.getMethod({ entry });

    if (typeof urlPart === 'string') {
      urlPart = escapeRegExp(urlPart);
    }
    return entry.message.params[mapMethodToAction[method]] &&
      entry.message.params[mapMethodToAction[method]].url.search(urlPart) > -1;
  },

  getStatus ({ entry }) {
    // status is only reasonable if it is a response
    return entry.message.params.response &&
      entry.message.params.response.status;
  },

  matchStatus ({ entry, status = '' } = {}) {

    if (typeof status === 'string') {
      status = escapeRegExp(status);
    }
    let logStatus = this.getStatus({ entry });
    if (logStatus) return logStatus.search(status) > -1;
  },
};

export default logEntry;
