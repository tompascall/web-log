const filter = {
	filterEntriesByMethod ({entries = [], method} = {}) {
    let filteredEntries = entries.filter( (entry) => {
      return entry.message.method === method;
    });
    return {
      filteredEntries
    };
	}
};

export default filter;
