import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import EligibleBuriedView from '../../components/EligibleBuriedView';

describe('Pre-need EligibleBuriedView component', () => {
  const formData = {
    name: {
      first: 'test',
      middle: undefined,
      last: 'name',
      suffix: undefined,
    },
  };

  it('renders and unmounts without crashing', () => {
    const wrapper = mount(<EligibleBuriedView formData={formData} />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });

  it('renders bolded test name', () => {
    const wrapper = mount(<EligibleBuriedView formData={formData} />);
    expect(wrapper.find('strong').text()).to.eq('test name');
    wrapper.unmount();
  });
});
