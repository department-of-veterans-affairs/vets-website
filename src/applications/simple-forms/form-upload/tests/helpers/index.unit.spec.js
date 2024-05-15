import sinon from 'sinon';
import { expect } from 'chai';
import { handleRouteChange } from '../../helpers';

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
});
