import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import PaymentInformationBlocked from '@@profile/components/direct-deposit/PaymentInformationBlocked';

describe('<PaymentInformationBlocked />', () => {
  it('renders', () => {
    const wrapper = shallow(<PaymentInformationBlocked />);
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });
  it('renders an AlertBox component', () => {
    const wrapper = shallow(<PaymentInformationBlocked />);
    expect(wrapper.find('AlertBox').length).to.equal(1);
    wrapper.unmount();
  });
  it('renders the correct phone number anchor tag', () => {
    const wrapper = shallow(<PaymentInformationBlocked />);
    const link = wrapper.find('a').first();
    expect(link.html()).to.contain('855-574-7286');
    expect(link.prop('href')).to.equal('tel:1-855-574-7286');
    expect(link.prop('aria-label')).to.equal('8 5 5. 5 7 4. 7 2 8 6.');
    expect(link.hasClass('no-wrap')).to.be.true;
    wrapper.unmount();
  });
});
