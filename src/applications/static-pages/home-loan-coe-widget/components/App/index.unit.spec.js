// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { App } from '.';

describe('Home Loan COE Login Widget <App>', () => {
  it('renders what we expect', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.text()).includes(
      'Please sign in to check the status of your COE',
    );
    expect(wrapper.find('button.va-button-primary')).to.have.lengthOf(1);
    expect(wrapper.find(`button.va-button-primary`).text()).to.equal(
      'Sign in or create an account',
    );
    wrapper.unmount();
  });
});
