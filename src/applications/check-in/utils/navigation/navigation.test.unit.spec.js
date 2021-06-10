import { expect } from 'chai';
import sinon from 'sinon';
import { goToNextPageWithToken } from './index';

describe('health care check in -- utils -- navigation', () => {
  describe('goToNextPageWithToken', () => {
    it('calls push on the route with correct params', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'some-token',
        },
      };
      const target = 'magic';
      goToNextPageWithToken(mockRouter, target);
      expect(push.called).to.be.true;
      expect(push.calledWith(`/some-token/magic`));
    });
  });
});
