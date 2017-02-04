const mockEntryGenerator = function ({ message } = {}) {
  return {
    message,
    toJSON () {
      return {
        message: JSON.stringify( { message:this.message })
      }
    }
  };
};

const mockEntries = [
  mockEntryGenerator({ message: {
    method: "Network.requestWillBeSent",
    params: {
      request: {
        url: "www/testurl1?testparam1=1&testparam2=2"
      }
    }
  }}),
  mockEntryGenerator({ message: {
    method: "Network.responseReceived",
    params: {
      response: {
        url: "www/testurl1?testparam1=1&testparam2=2"
      }
    }
  }}),
  mockEntryGenerator({message: {
    method: "Network.loadingFailed",
    params: {
    }
  }}),

  mockEntryGenerator({message: {
    method: "Network.loadingFinished",
    params: {
    }
  }}),
];

const mockDriver = {
  manage () { return this },
  logs () { return this },
  get (logType) {
    if (logType === 'performance') {
      return Promise.resolve(mockEntries);
    }
  }
};

export default mockDriver;
