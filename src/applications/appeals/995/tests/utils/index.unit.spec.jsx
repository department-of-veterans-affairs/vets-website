import { expect } from 'chai';
import sinon from 'sinon-v20';
import { onFormLoaded } from '../../utils';

describe('onFormLoaded', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should direct to the correct returnUrl', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    onFormLoaded({ returnUrl: '/housing-risk', router: routerSpy });
    expect(routerSpy.push.firstCall.args[0]).to.eq('/housing-risk');
  });
});
