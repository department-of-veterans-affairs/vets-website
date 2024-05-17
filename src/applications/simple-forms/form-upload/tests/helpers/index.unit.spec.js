import sinon from 'sinon';
import { expect } from 'chai';
import { getFileSize, handleRouteChange } from '../../helpers';

describe('Helpers', () => {
  describe('handleRouteChange', () => {
    it('pushes the href to history', () => {
      const fakeHref = 'fake-href';
      const history = {
        push(_) {},
      };
      const historySpy = sinon.spy(history, 'push');
      const route = { detail: { href: fakeHref } };

      handleRouteChange(route, history);

      expect(historySpy.calledWith(fakeHref)).to.be.true;
    });
  });

  describe('getFileSize', () => {
    it('should be in bytes for values < 999', () => {
      expect(getFileSize(998)).to.equal('998 B');
    });
    it('should be in KB for values between a thousand and a million', () => {
      expect(getFileSize(1024)).to.equal('1 KB');
    });
    it('should be in MB for values greater than a million', () => {
      expect(getFileSize(2000000)).to.equal('2.0 MB');
    });
  });
});
