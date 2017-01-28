import weblog from '../weblog';

test('get weblog', () => {
  expect({}.toString.call(weblog)).toBe('[object Object]');
});
