import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VetTecProgramSearchResult from '../../components/vet-tec/VetTecProgramSearchResult';
import { formatCurrency } from '../../utils/helpers';

const defaultProps = {
  result: {
    city: 'CHICAGO',
    country: 'USA',
    description: 'COMPUTER SCIENCE',
    dodBah: 1929,
    facilityCode: '3V000113',
    institutionName: 'CODE PLATOON',
    lengthInHours: '680',
    lengthInWeeks: 2,
    preferredProvider: false,
    programType: 'NCD',
    state: 'IL',
    tuitionAmount: 10000,
    vaBah: 1998,
  },
};

describe('<VetTecProgramSearchResult>', () => {
  it('should render correct data', () => {
    const wrapper = mount(<VetTecProgramSearchResult {...defaultProps} />);
    expect(wrapper.find('h2').text()).to.eq(defaultProps.result.description);
    expect(wrapper.find('.institution-name').text()).to.eq(
      defaultProps.result.institutionName,
    );
    expect(wrapper.find('.institution-location').text()).to.contain(
      defaultProps.result.city,
    );
    expect(wrapper.find('.institution-location').text()).to.contain(
      defaultProps.result.state,
    );
    expect(wrapper.find('.info-flag').text()).to.eq('2 weeks');
    expect(wrapper.find('.programTuition').text()).to.eq(
      formatCurrency(defaultProps.result.tuitionAmount),
    );
    expect(wrapper.find('.programHousingAllowance').text()).to.eq(
      formatCurrency(defaultProps.result.dodBah),
    );
    expect(wrapper.find('.info-flag').text()).to.eq('2 weeks');
    expect(wrapper.find('.preferred-flag')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should display lowest housing allowance provider', () => {
    const props = {
      result: {
        ...defaultProps.result,
        vaBah: 500,
      },
    };
    const wrapper = mount(<VetTecProgramSearchResult {...props} />);
    expect(wrapper.find('.programHousingAllowance').text()).to.eq(
      formatCurrency(500),
    );
    wrapper.unmount();
  });

  it('should display preferred provider', () => {
    const props = {
      result: {
        ...defaultProps.result,
        preferredProvider: true,
      },
    };
    const wrapper = mount(<VetTecProgramSearchResult {...props} />);
    expect(wrapper.find('.preferred-flag')).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
