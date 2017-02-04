import mapMethodToAction from '../mapMethodToAction';

const mockRawEntryGenerator = function ({ message } = {}) {
  return {
    message,
    toJSON () {
      return {
        message: JSON.stringify( { message:this.message })
      }
    }
  };
};

const mockEntryGenerator = function ({
    method = 'Network.requestWillBeSent',
    url = '',
    fakeProperty
  }) {

  let mockEntry = {
    message: {
      method,
      params: {
        [ mapMethodToAction[method] ]: {
          url
        }
      }
    }
  };

  if (fakeProperty) {
    mockEntry.message.fakeProperty = fakeProperty;
  }
  return mockEntry;
}

let mockEntries = [
  mockRawEntryGenerator({ message: {
    method: "Network.requestWillBeSent",
    params: {
      request: {
        url: "www/testurl1?testparam1=1&testparam2=2"
      }
    }
  }})
];

const mockDriver = {
  manage () { return this },
  logs () { return this },
  get (logType) {
    if (logType === 'performance') {
      return Promise.resolve(mockEntries);
    }
  },
  setEntries ({ entries } = {}) {
    mockEntries = entries.slice();
  }
};

export {
  mockDriver,
  mockRawEntryGenerator,
  mockEntryGenerator
}
