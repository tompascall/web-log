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

  getStringifiedEntryMessage (entry) {
    return entry.toJSON().message;
  },

  getRawEntries ({ driver } = {}) {
    this.checkDriver({ driver });
    return driver.manage().logs().get('performance');
  },

  getEntryMessage (entry) {
    return JSON.parse(this.getStringifiedEntryMessage(entry));
  }
};

export default get;
