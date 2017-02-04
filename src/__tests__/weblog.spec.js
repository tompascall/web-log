import weblog from '../weblog';

describe('weblog', () => {
  it('weblog is an object', () => {
    expect({}.toString.call(weblog)).toBe('[object Object]');
  });

  it('logEntries is defined on weblog', () => {
    expect(weblog.logEntries).toBeDefined();
  });


  it('logEntry is defined on weblog', () => {
    expect(weblog.logEntry).toBeDefined();
  });
});
