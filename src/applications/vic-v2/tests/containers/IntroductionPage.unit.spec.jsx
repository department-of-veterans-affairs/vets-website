import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionPage } from '../../containers/IntroductionPage';

describe('VIC <IntroducionPage>', () => {
  it('should render', () => {
    const tree = shallow(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
        user={{
          login: {},
          profile: {
            services: [],
          },
        }}
      />,
    );
    expect(tree.find('FormTitle').exists()).to.be.true;
    expect(tree.text()).to.contain('Sign in and verify your identity');
    expect(
      tree
        .find('.list-two')
        .find('h5')
        .text(),
    ).to.contain('Sign in and verify your identity');
    tree.unmount();
  });
  it('should render signed in and unverified', () => {
    const tree = shallow(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
        user={{
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            services: [],
          },
        }}
      />,
    );
    expect(tree.find('FormTitle').exists()).to.be.true;
    expect(
      tree
        .find('.list-two')
        .find('h5')
        .text(),
    ).to.contain('Verify your identity');
    tree.unmount();
  });
  it('should render signed in and verified', () => {
    const tree = shallow(
      <IntroductionPage
        route={{
          formConfig: {},
        }}
        user={{
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            services: ['identity-proofed'],
          },
        }}
      />,
    );
    expect(tree.find('FormTitle').exists()).to.be.true;
    expect(
      tree
        .find('.list-two')
        .find('h5')
        .text(),
    ).to.contain('Sign In');
    tree.unmount();
  });
});
