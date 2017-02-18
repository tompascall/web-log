const weblog = require('../web-log');

describe('weblog', () => {
  it('should be an object', () => {
    expect({}.toString.call(weblog)).toBe('[object Object]');
  });

  it('exposes logEntries', () => {
    expect(weblog.logEntries).toBeDefined();
  });


  it('exposes logEntry', () => {
    expect(weblog.logEntry).toBeDefined();
  });

  it('exposes driver', () => {
    expect(weblog.driverUtil).toBeDefined();
  });
});
