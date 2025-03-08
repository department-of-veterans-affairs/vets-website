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

  it('should contain va-telephone component', () => {
    const wrapper = shallow(<GetFormHelp />);

    expect(wrapper.find('va-telephone').length).to.equal(1);
    expect(wrapper.find('va-telephone').props().contact).to.contain(
      '8884424551',
    );
    expect(wrapper.find('va-telephone').props().international).to.be.true;
    expect(wrapper.find('va-telephone').props()['not-clickable']).to.be.true;

    wrapper.unmount();
  });

  it('should contain va-link component', () => {
    const wrapper = shallow(<GetFormHelp />);

    expect(wrapper.find('va-link').length).to.equal(1);
    expect(wrapper.find('va-link').props().text).to.contain(
      'visit Education Liaison Representatives - Education and Training.',
    );
    expect(wrapper.find('va-link').props().href).to.contain(
      'https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp',
    );

    wrapper.unmount();
  });
});
