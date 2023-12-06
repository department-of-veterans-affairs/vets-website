import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ServicePeriodView from '../../components/ServicePeriodView';

describe('ServicePeriodView', () => {
  it('renders service period information', () => {
    const formData = {
      serviceBranch: 'Army',
      activeServiceDateRange: {
        from: '2022-01-01',
        to: '2023-01-01',
      },
    };

    const wrapper = shallow(<ServicePeriodView formData={formData} />);

    expect(wrapper.find('strong').text()).to.equal('Army');
    expect(wrapper.text()).to.contain('01/01/2022');
    expect(wrapper.text()).to.contain('01/01/2023');
    wrapper.unmount();
  });
});
