import { expect } from 'chai';
import sinon from 'sinon';
import routes from '../routes';

describe('Form 996 routes', () => {
  const { onEnter } = routes[0].indexRoute;
  it('should redirect from the root to /introduction', () => {
    const replace = sinon.spy();
    onEnter(null, replace);
    expect(replace.calledWith('/introduction')).to.be.true;
  });
});
