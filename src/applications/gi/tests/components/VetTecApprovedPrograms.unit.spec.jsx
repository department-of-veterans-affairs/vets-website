import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';

import VetTecApprovedPrograms from '../../components/vet-tec/VetTecApprovedPrograms';
import { selectRadio } from 'platform/testing/unit/schemaform-utils';

const institution = {
  programs: [
    {
      description: 'Program Name',
      schoolLocale: 'City',
      providerWebsite: 'https://galvanize.edu',
      phoneAreaCode: '843',
      phoneNumber: '333-3333',
    },
  ],
};

describe('<VetTecApprovedProgram>', () => {
  it('should render', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution,
    };
    const wrapper = shallow(<VetTecApprovedPrograms {...defaultProps} />);
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
    const wrapper = mount(<VetTecApprovedPrograms {...defaultProps} />);
    expect(wrapper.find('.program-length').length).to.eq(1);
    expect(wrapper.find('.program-length').text()).to.eq('TBD');
    wrapper.unmount();
  });

  it('should log GTM analytics event', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution,
    };

    const wrapper = mount(<VetTecApprovedPrograms {...defaultProps} />);

    selectRadio(wrapper, 'vetTecProgram', 'Program Name');

    expect(global.window.dataLayer[0]['gibct-form-value']).to.eq(
      institution.programs[0].description,
    );
    wrapper.unmount();
  });
});
