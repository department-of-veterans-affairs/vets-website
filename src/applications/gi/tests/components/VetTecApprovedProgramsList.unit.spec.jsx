import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';

import VetTecApprovedProgramsList from '../../components/vet-tec/VetTecApprovedProgramsList';

const programs = [
  {
    description: 'Program Name 1',
    schoolLocale: 'City',
    providerWebsite: 'https://galvanize.edu',
    phoneAreaCode: '843',
    phoneNumber: '333-3333',
  },
  {
    description: 'Program Name 2',
    schoolLocale: 'City',
    providerWebsite: 'https://galvanize.edu',
    phoneAreaCode: '843',
    phoneNumber: '333-3333',
  },
];

const defaultProps = {
  store: createCommonStore(),
  programs,
  selectedProgram: 'Program Name 1',
};

describe('<VetTecApprovedProgramsList>', () => {
  it('should render', () => {
    const wrapper = shallow(<VetTecApprovedProgramsList {...defaultProps} />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should display 0 hours as TBD', () => {
    const props = {
      ...defaultProps,
      programs: [
        {
          ...programs[0],
          lengthInHours: '0',
        },
      ],
    };
    const wrapper = mount(<VetTecApprovedProgramsList {...props} />);
    expect(
      wrapper.find('.vet-tec-programs-table #program-length').length,
    ).to.eq(1);
    expect(
      wrapper.find('.vet-tec-programs-table #program-length').text(),
    ).to.eq('TBD');
    wrapper.unmount();
  });

  it('should display (Your selected program) for selected program', () => {
    const props = {
      ...defaultProps,
      selectedProgram: 'Program Name 2',
    };
    const wrapper = mount(<VetTecApprovedProgramsList {...props} />);
    expect(wrapper.find('.vads-u-font-weight--bold').length).to.eq(2);
    wrapper.unmount();
  });
});
