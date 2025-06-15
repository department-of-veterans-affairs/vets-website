// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { MhvSimpleSigninCallToAction } from 'applications/static-pages/mhv-simple-signin-cta';
import { App } from './index';

describe('Get Secure Messaging Page <App>', () => {
  it('renders simple CTA', () => {
    const wrapper = shallow(
      <App facilities={[{ usesCernerMessaging: false }]} />,
    );
    expect(wrapper.find(MhvSimpleSigninCallToAction)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
