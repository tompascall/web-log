import weblog from '../weblog';

describe('weblog', () => {
  it('weblog is an object', () => {
    expect({}.toString.call(weblog)).toBe('[object Object]');
  });

  it('get is defined on weblog', () => {
    expect(weblog.get).toBeDefined();
  });


  it('filter is defined on weblog', () => {
    expect(weblog.filter).toBeDefined();
  });
});
