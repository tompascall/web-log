const methodMap = {
  "Network.requestWillBeSent": "request",
  "Network.responseReceived": "response"
};

const filter = {
	filterEntriesByMethod ({entries = [], method} = {}) {
    let filteredEntries = entries.filter( (entry) => {
      return entry.message.method === method;
    });
    return {
      filteredEntries
    };
	},

  getMethod ({ entry } = {}) {
    return entry.message.method;
  },

  matchUrlPart ({ entry, urlPart = '' } = {}) {
    let method = this.getMethod({ entry });
    return entry.message.params[methodMap[method]] &&
      entry.message.params[methodMap[method]].url.search(urlPart) > -1;
  },

  entriesByUrlPart ({ entries, urlPart } = {}) {
    return entries.filter( (entry) => {
      return this.matchUrlPart({ entry, urlPart }); 
    });
  }
};

export default filter;
