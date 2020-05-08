import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';

import VetTecApprovedProgramsList from '../../components/vet-tec/VetTecApprovedProgramsList';

const institution = {
  programs: [
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
  ],
};

describe('<VetTecApprovedProgramsList>', () => {
  it('should render', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution,
    };
    const wrapper = shallow(<VetTecApprovedProgramsList {...defaultProps} />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should display 0 hours as TBD', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution: {
        ...institution,
        programs: [
          {
            ...institution.programs[0],
            lengthInHours: '0',
          },
        ],
      },
    };
    const wrapper = mount(<VetTecApprovedProgramsList {...defaultProps} />);
    expect(wrapper.find('.program-length').length).to.eq(1);
    expect(wrapper.find('.program-length').text()).to.eq('TBD');
    wrapper.unmount();
  });

  it('should display check icon for pre-selected program', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution,
      selectedProgram: '',
      preSelectedProgram: 'Program Name 2',
    };
    const wrapper = mount(<VetTecApprovedProgramsList {...defaultProps} />);
    expect(wrapper.find('.sr-only').length).to.eq(1);
    wrapper.unmount();
  });
});
