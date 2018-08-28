import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { BetaGate } from '../../containers/BetaGate';

describe('BetaGate', () => {
  it('should show loading spinner', () => {
    const tree = mount(
      <BetaGate
        loading
        location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>
    );
    expect(tree.find('LoadingIndicator').exists()).to.be.true;
  });

  it('should show logged out message', () => {
    const tree = mount(
      <BetaGate
        location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>
    );
    expect(tree.find('AlertBox').props().headline).to.contain('not signed in');
  });

  it('should show unavailble message', () => {
    const tree = mount(
      <BetaGate
        loggedIn
        location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>
    );
    expect(shallow(tree.find('AlertBox').props().content).text()).to.contain('unavailable');
  });

  it('should show beta message', () => {
    const tree = mount(
      <BetaGate
        loggedIn
        formAvailable
        location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>
    );
    expect(shallow(tree.find('AlertBox').props().content).text()).to.contain('beta tool');
  });

  it('should not gate the form on the intro page', () => {
    const tree = mount(
      <BetaGate
        betaUser
        claimsAccess
        formAvailable
        loggedIn
        location={{ pathname: '/introduction' }}>
        <p>It worked!</p>
      </BetaGate>
    );
    expect(tree.text()).to.equal('It worked!');
  });

  it('should render a RequiredLoginView', () => {
    const tree = shallow(
      <BetaGate
        betaUser
        claimsAccess
        formAvailable
        loggedIn
        location={{ pathname: '/middle-of-the-form' }}>
        <p>It worked!</p>
      </BetaGate>
    );
    expect(tree.find('RequiredLoginView').exists()).to.be.true;
  });
});
