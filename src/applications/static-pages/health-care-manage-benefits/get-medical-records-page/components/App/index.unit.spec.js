// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import { App } from './index';

describe('Get Medical Records Page <App>', () => {
  it('renders what we expect when not a Cerner patient', () => {
    const wrapper = shallow(
      <App facilities={[{ usesCernerMedicalRecords: false }]} />,
    );
    expect(wrapper.find(UnauthContent)).to.have.lengthOf(1);
    expect(wrapper.find(AuthContent)).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders what we expect when a Cerner patient', () => {
    const wrapper = shallow(
      <App facilities={[{ usesCernerMedicalRecords: true }]} />,
    );
    expect(wrapper.find(UnauthContent)).to.have.lengthOf(0);
    expect(wrapper.find(AuthContent)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
