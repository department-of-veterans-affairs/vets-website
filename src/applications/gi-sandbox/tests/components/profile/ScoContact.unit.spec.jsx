import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ScoContact } from '../../../components/profile/ScoContact';

const sco = {
  facilityCode: '2V000203',
  institutionName: 'GALVANIZE INC',
  priority: 'SECONDARY',
  firstName: 'MARTIN',
  lastName: 'INDIATSI',
  title: 'SCHOOL CERTIFYING OFFICIAL',
  phoneAreaCode: '303',
  phoneNumber: '749-0110',
  phoneExtension: null,
  email: 'VABENEFITS@GALVANIZE.COM',
};

describe('<ScoContact>', () => {
  it('should render', () => {
    const wrapper = shallow(<ScoContact />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('return null when no sco is supplied', () => {
    expect(ScoContact()).to.be.null;
  });

  it('return the contact information for an SCO', () => {
    const wrapper = shallow(ScoContact(sco, 0));

    expect(wrapper.text().includes('MARTIN INDIATSI')).to.be.true;
    expect(wrapper.text().includes('SCHOOL CERTIFYING OFFICIAL')).to.be.true;
    wrapper.unmount();
  });
});
