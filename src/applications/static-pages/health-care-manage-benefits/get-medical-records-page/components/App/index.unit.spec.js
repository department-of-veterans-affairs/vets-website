// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Relative imports.
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import App from './index';

describe('Get Medical Records Page <App>', () => {
  it('renders what we expect when not a Cerner patient', () => {
    const wrapper = mount(<App isCernerPatient={false} />);
    expect(wrapper.find(UnauthContent)).toHaveLength(1);
    expect(wrapper.find(AuthContent)).toHaveLength(0);
    wrapper.unmount();
  });

  it('renders what we expect when a Cerner patient', () => {
    const wrapper = mount(<App isCernerPatient />);
    expect(wrapper.find(UnauthContent)).toHaveLength(0);
    expect(wrapper.find(AuthContent)).toHaveLength(1);
    wrapper.unmount();
  });
});
