import { expect } from 'chai';
import { isUUID } from './index';

describe('check in', () => {
  describe('token format utils', () => {
    it('token is undefined', () => {
      expect(isUUID(undefined)).to.be.false;
    });
    it('token is valid uuid - random token', () => {
      expect(isUUID('e0027705-5bde-4e18-bc16-ae715b1ea905')).to.be.true;
    });
    it('token is valid uuid - sample token from LoROTA', () => {
      expect(isUUID('d602d9eb-9a31-484f-9637-13ab0b507e0d')).to.be.true;
    });
    it('token is not valid uuid', () => {
      expect(isUUID('garbage')).to.be.false;
    });
  });
});
