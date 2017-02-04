const methodMap = {
  "Network.requestWillBeSent": "request",
  "Network.responseReceived": "response"
};

const filter = {
	entriesByMethod ({entries, method} = {}) {
    let filteredEntries = (
      entries || this.filteredEntries || []
    ).filter( (entry) => {
      return entry.message.method === method;
    });
    
    return Object.assign({}, this, {
      filteredEntries
    });
	},

  getMethod ({ entry } = {}) {
    return entry.message.method;
  },

  matchUrlPart ({ entry, urlPart = '' } = {}) {
    let method = this.getMethod({ entry });
    return entry.message.params[methodMap[method]] &&
      entry.message.params[methodMap[method]].url.search(urlPart) > -1;
  },

  entriesByUrlPart ({ entries, urlPart = '' } = {}) {
    let filteredEntries = (
      entries || this.filteredEntries || []
    )
    .filter( (entry) => {
      return this.matchUrlPart({ entry, urlPart }); 
    });

    let result = Object.assign({}, this, {
      filteredEntries
    });
    return result; 
  }
};

export default filter;
