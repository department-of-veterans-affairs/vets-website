import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { BetaGate } from '../../containers/BetaGate';

describe('BetaGate', () => {
  it('should show loading spinner', () => {
    const tree = mount(
      <BetaGate loading location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>,
    );
    expect(tree.find('LoadingIndicator').exists()).to.be.true;
  });

  it('should show unavailble message', () => {
    const tree = mount(
      <BetaGate loggedIn location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>,
    );
    expect(shallow(tree.find('AlertBox').props().content).text()).to.contain(
      'unavailable',
    );
  });

  it('should show beta message', () => {
    const tree = mount(
      <BetaGate loggedIn formAvailable location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>,
    );
    expect(shallow(tree.find('AlertBox').props().content).text()).to.contain(
      'beta tool',
    );
  });
});
