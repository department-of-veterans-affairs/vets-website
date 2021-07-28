import { expect } from 'chai';
import { isUUID } from './index';

describe('check in', () => {
  describe('token format utils', () => {
    it('token is undefined', () => {
      expect(isUUID(undefined)).to.be.false;
    });
    it('token is valid uuid', () => {
      expect(isUUID('e0027705-5bde-4e18-bc16-ae715b1ea905')).to.be.true;
    });
    it('token is not valid uuid', () => {
      expect(isUUID('garbage')).to.be.false;
    });
  });
});
