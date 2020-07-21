import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ServicesAtFacility from '../../components/ServicesAtFacility';

describe('<ServicesAtFacility>', () => {
  it('Should render when facility has services', () => {
    const testFacility = {
      id: 'vba_313f',
      type: 'facility',
      attributes: {
        classification: 'Voc Rehab And Employment',
        facilityType: 'va_benefits_facility',
        id: 'vba_313f',
        services: {
          benefits: ['VocationalRehabilitationAndEmploymentAssistance'],
        },
      },
    };
    const wrapper = shallow(<ServicesAtFacility facility={testFacility} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('Should NOT render when facility has no services', () => {
    const testFacility = {
      id: 'vba_313f',
      type: 'facility',
      attributes: {
        classification: 'Voc Rehab And Employment',
        facilityType: 'va_benefits_facility',
        id: 'vba_313f',
        services: {
          benefits: [],
        },
      },
    };
    const wrapper = shallow(<ServicesAtFacility facility={testFacility} />);
    expect(wrapper.type()).equal(null);
    wrapper.unmount();
  });
});
