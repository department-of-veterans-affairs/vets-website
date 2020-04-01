import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import localStorage from 'platform/utilities/storage/localStorage';
import SingleSignOnInfoModal from '../../components/SingleSignOnInfoModal';

describe('Announcements <SingleSignOnInfoModal>', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('does not render for users that are logged in but without SSO', () => {
    const tree = mount(<SingleSignOnInfoModal isLoggedIn />);

    expect(tree.html()).to.equal(null);

    tree.unmount();
  });

  it('renders for logged in SSO users', () => {
    localStorage.setItem('hasSessionSSO', true);
    const dismiss = sinon.spy();

    const tree = mount(<SingleSignOnInfoModal isLoggedIn dismiss={dismiss} />);

    expect(tree.text()).to.contain(
      'Sign in once to access the VA sites you use most',
    );

    tree.unmount();
  });

  it('closes when the dismiss handler is fired', () => {
    localStorage.setItem('hasSessionSSO', true);
    const dismiss = sinon.spy();

    const tree = mount(<SingleSignOnInfoModal isLoggedIn dismiss={dismiss} />);

    tree
      .find('button')
      .at(1)
      .props()
      .onClick();
    expect(dismiss.called).to.be.true;

    tree.unmount();
  });
});
