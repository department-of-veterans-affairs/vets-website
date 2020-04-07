import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VetTecProgramSearchResult from '../../components/vet-tec/VetTecProgramSearchResult';
import { formatCurrency, locationInfo } from '../../utils/helpers';

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
    schoolClosing: false,
    cautionFlags: [],
  },
  constants: {
    AVGDODBAH: 1000,
  },
};

describe('<VetTecProgramSearchResult>', () => {
  it('should render correct data', () => {
    const wrapper = mount(<VetTecProgramSearchResult {...defaultProps} />);
    expect(wrapper.find('h2').text()).to.eq(defaultProps.result.description);
    expect(wrapper.find('.institution-name').text()).to.eq(
      defaultProps.result.institutionName,
    );
    expect(wrapper.find('.institution-location').text()).to.eq(
      locationInfo(
        defaultProps.result.city,
        defaultProps.result.state,
        defaultProps.result.country,
      ),
    );
    expect(wrapper.find('.institution-location').text()).to.contain(
      defaultProps.result.state,
    );
    expect(wrapper.find('.info-flag').text()).to.eq('680 hours');
    expect(wrapper.find('.programTuition').text()).to.eq(
      formatCurrency(defaultProps.result.tuitionAmount),
    );
    expect(wrapper.find('.programHousingAllowance').text()).to.eq(
      `${formatCurrency(
        defaultProps.constants.AVGDODBAH / 2,
      )} - ${formatCurrency(defaultProps.result.dodBah)}`,
    );
    expect(wrapper.find('.info-flag').text()).to.eq('680 hours');
    expect(wrapper.find('.preferred-flag')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should display preferred provider', () => {
    const props = {
      ...defaultProps,
      result: {
        ...defaultProps.result,
        preferredProvider: true,
      },
    };
    const wrapper = mount(<VetTecProgramSearchResult {...props} />);
    expect(wrapper.find('.preferred-flag')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should display 0 hours as TBD', () => {
    const props = {
      ...defaultProps,
      result: {
        ...defaultProps.result,
        lengthInHours: '0',
      },
    };
    const wrapper = mount(<VetTecProgramSearchResult {...props} />);
    expect(wrapper.find('.info-flag').text()).to.eq('TBD');
    wrapper.unmount();
  });

  it('should display school closing and caution alerts', () => {
    const props = {
      ...defaultProps,
      result: {
        ...defaultProps.result,
        schoolClosing: true,
        cautionFlags: [{ title: 'reason for caution', id: '1' }],
      },
    };
    const wrapper = mount(<VetTecProgramSearchResult {...props} />);
    expect(wrapper.find('.usa-alert')).to.have.lengthOf(2);
    wrapper.unmount();
  });

  it('should display multiple caution alerts', () => {
    const props = {
      ...defaultProps,
      result: {
        ...defaultProps.result,
        cautionFlags: [
          { title: 'reason one', id: '1' },
          { title: 'reason two', id: '2' },
          { title: 'reason three', id: '3' },
          { title: 'reason four', id: '4' },
        ],
      },
    };
    const wrapper = mount(<VetTecProgramSearchResult {...props} />);
    const reasonList = wrapper.find('.usa-alert-text').find('ul');
    expect(reasonList.children()).to.have.lengthOf(4);
    wrapper.unmount();
  });
});
