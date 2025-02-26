import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LicenseCertificationFaq from '../../components/LicenseCertificationFaq';

describe('<LicenseCertificationFaq/>', () => {
  it('should render', () => {
    const wrapper = shallow(<LicenseCertificationFaq />);
    expect(wrapper.html()).to.not.be.undefined;
    expect(wrapper.find('va-accordion').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render FAQ items', () => {
    const wrapper = shallow(<LicenseCertificationFaq />);
    const accordion = wrapper.find('va-accordion');
    expect(accordion.find('va-accordion-item').exists()).to.be.true;
    wrapper.unmount();
  });
});
