import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { COVID19Alert } from '../covid-19';

describe('COVID19Alert component', () => {
  it('renders', () => {
    const wrapper = shallow(<COVID19Alert />);
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });
  it('renders an va-alert component', () => {
    const wrapper = shallow(<COVID19Alert />);
    expect(wrapper.find('va-alert').length).to.equal(1);
    wrapper.unmount();
  });
  it('renders the default chat hours if no props are set', () => {
    const wrapper = shallow(<COVID19Alert />);
    expect(wrapper.html()).to.contain(
      '9:00 a.m. to 5:00 p.m., Monday through Friday',
    );
    wrapper.unmount();
  });
  it('renders the VISN 8 chat hours if passed a VISN 8 facilityId', () => {
    const wrapper = shallow(<COVID19Alert facilityId="672" />);
    expect(wrapper.html()).to.contain(
      '8:00 a.m. to 4:00 p.m., Monday through Friday',
    );
    wrapper.unmount();
  });
  it('renders the VISN 23 chat hours if passed a VISN 23 facilityId', () => {
    const wrapper = shallow(<COVID19Alert facilityId="656" />);
    expect(wrapper.html()).to.contain(
      '7:30 a.m. to 4:30 p.m., Monday through Friday',
    );
    wrapper.unmount();
  });
  it('the anchor tag is configured correctly', () => {
    const wrapper = shallow(<COVID19Alert />);
    const anchor = wrapper.find('a');
    expect(anchor.props().href).to.equal(
      'https://mobile.va.gov/app/va-health-chat',
    );
    expect(anchor.props().className.includes('usa-button-primary')).to.be.true;
    wrapper.unmount();
  });
});
