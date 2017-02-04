import mapMethodToAction from './mapMethodToAction';

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
    return entry.message.params[mapMethodToAction[method]] &&
      entry.message.params[mapMethodToAction[method]].url.search(urlPart) > -1;
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
