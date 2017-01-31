const get = {
  checkDriver ({ driver } = {}) {
    try {
      if (typeof driver.manage().logs().get !== 'function') {
        throw Error();
      }
    }
    catch (e) {
      throw Error('driver has not been set up properly, cannot log network traffic');
    }
  },

  stringifiedEntryMessage (entry) {
    return entry.toJSON().message;
  },

  rawEntries ({ driver } = {}) {
    this.checkDriver({ driver });
    return driver.manage().logs().get('performance');
  },

  entryMessage (entry) {
    return JSON.parse(this.stringifiedEntryMessage(entry));
  },

  entries ({ driver }) {
    return this.rawEntries({ driver })
    .then( (rawEntries) => {
      return rawEntries.map( (rawEntry) => {
        return this.entryMessage(rawEntry);
      });
    });
  }
};

export default get;
