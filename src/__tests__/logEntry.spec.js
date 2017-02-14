const logEntries = require('../logEntries');
const logEntry = require('../logEntry');
const { mockDriver, mockEntryGenerator } = require('../mocks/mocks');

describe('logEntry', () => {

  describe('stringifiedEntryMessage', () => {
    let mockEntry, entries;

    beforeEach( () => {
      return logEntries.getRawEntries({driver : mockDriver})
      .then( (result) => {
        entries = result;
        mockEntry = entries[0];
      });
    });

    it('calls the mockEntry toJSON function', () => {
      spyOn(mockEntry, 'toJSON').and.callThrough();
      logEntry.getStringifiedEntryMessageFromRawEntry(mockEntry);
      expect(mockEntry.toJSON).toHaveBeenCalled();
    });

    it('gives back a parseable stringified object', () => {
      let message = logEntry.getStringifiedEntryMessageFromRawEntry(mockEntry);
      let parseMessage = function () {
        return JSON.parse(message);
      };
      expect(parseMessage).not.toThrow();
    });
  });

  describe('entryMessage', () => {
    let mockEntry, entries;

    beforeAll( () => {
      return logEntries.getRawEntries({driver : mockDriver})
      .then( (result) => {
        entries = result;
        mockEntry = entries[0];
      });
    });

    it('returns the JSON parsed message property of the toJSON function call', () => {
      let message = logEntry.entryMessageFromRawEntry(mockEntry);
      expect(message).toEqual({ message: mockEntry.message});
    });
  });

  describe('getUrl', () => {
    let entry;

    beforeAll( () => {
      entry = mockEntryGenerator({
        method: "Network.requestWillBeSent",
        url: "www/testurl1?testparam1=1&testparam2=2",
        fakeProperty: 'fakeData'
      });
    });
    
    it('should get url', () => {
      let url = logEntry.getUrl({ entry });
      expect(url).toEqual("www/testurl1?testparam1=1&testparam2=2");
    });
  });

});
