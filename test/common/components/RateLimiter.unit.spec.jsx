import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { RateLimiter } from '../../../src/js/common/components/RateLimiter';

describe.only('<RateLimiter>', () => {
  it('should display limited content when over threshold', () => {
    window.settings = {
      rateLimits: {
        app: {
          authed: 0.75,
          unauthed: 0.75
        }
      }
    };

    const stub = sinon.stub(Math, 'random').returns(0.1);

    const tree = mount(
      <RateLimiter
        id="app"
        renderLimitedContent={() => <div>Limited content</div>}>
        <div>Real content</div>
      </RateLimiter>
    );

    expect(tree.text()).to.contain('Limited content');

    stub.resetBehavior();
  });
});
