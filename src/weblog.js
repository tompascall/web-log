const weblog = {
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

  getRawEntries ({ driver } = {}) {
    this.checkDriver({ driver });
    return Promise.resolve();
  }
};

export default weblog;

