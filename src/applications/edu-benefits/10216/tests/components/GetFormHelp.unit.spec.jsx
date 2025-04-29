import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GetFormHelp from '../../components/GetFormHelp';

describe('<GetFormHelp />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<GetFormHelp />);

    expect(wrapper.exists()).to.be.ok;

    wrapper.unmount();
  });

  it('should contain va-link component', () => {
    const wrapper = shallow(<GetFormHelp />);

    expect(wrapper.find('va-link').length).to.equal(1);
    expect(wrapper.find('va-link').props().text).to.contain(
      'contact your Education Liaison Representative.',
    );
    expect(wrapper.find('va-link').props().href).to.contain(
      'https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp',
    );

    wrapper.unmount();
  });
});
