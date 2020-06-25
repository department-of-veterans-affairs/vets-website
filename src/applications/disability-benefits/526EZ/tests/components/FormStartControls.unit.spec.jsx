import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import FormStartControls from '../../components/FormStartControls';

describe.skip('526 <FormStartControls>', () => {
  it('should render unauthenticated view', () => {
    const authenticate = sinon.spy();
    const tree = shallow(
      <FormStartControls
        authenticate={authenticate}
        route={{
          formConfig: {},
        }}
        user={{
          login: {},
          profile: {
            savedForms: [],
            services: [],
          },
        }}
      />,
    );
    tree.find('button').simulate('click');
    expect(tree.find('button').text()).to.contain('Sign');
    expect(tree.find('.usa-alert').text()).to.contain(
      'sign in and verify your identity',
    );
    expect(authenticate.called).to.be.true;
    tree.unmount();
  });
  it('should render authenticated view', () => {
    const tree = shallow(
      <FormStartControls
        route={{
          formConfig: {},
        }}
        user={{
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            savedForms: [],
            services: [],
          },
        }}
      />,
    );

    expect(tree.find('.usa-alert').text()).to.contain(
      'If you have a premium DS Logon or My HealtheVet account',
    );
    expect(tree.find('a').text()).to.contain('Verify your identity');
    tree.unmount();
  });
  it('should render verified view', () => {
    const tree = shallow(
      <FormStartControls
        route={{
          formConfig: {},
        }}
        user={{
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            verified: true,
            savedForms: [],
            services: [],
          },
        }}
      />,
      { context: { store: {} } },
    );

    expect(tree.find('withRouter(Connect(SaveInProgressIntro))').exists()).to.be
      .true;
    tree.unmount();
  });
});
