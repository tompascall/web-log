import { checkDriver } from '../../driver/driver';
import { mockDriver } from '../mocks/mocks';

describe.only('checkDriver', () => {
  it('should throw err if not driver given or not set up properly', () => {
    let fakeCallWithoutDriver = () => {
     checkDriver();
    };
    let fakeCallWithDriver = () => {
      checkDriver({ driver: mockDriver});
    };

    expect(fakeCallWithoutDriver).toThrow();
    expect(fakeCallWithDriver).not.toThrow();
  });
});
