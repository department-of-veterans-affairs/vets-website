import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ServicesAtFacility from '../../components/ServicesAtFacility';

describe('<ServicesAtFacility>', () => {
  it('Should render when facility has services', () => {
    const testFacilityV1 = {
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
    const testFacilityV0 = {
      id: 'vba_313f',
      type: 'facility',
      attributes: {
        classification: 'Voc Rehab And Employment',
        facilityType: 'va_benefits_facility',
        id: 'vba_313f',
        services: {
          benefits: {
            standard: ['VocationalRehabilitationAndEmploymentAssistance'],
          },
        },
      },
    };
    let wrapper = shallow(<ServicesAtFacility facility={testFacilityV1} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
    wrapper = shallow(<ServicesAtFacility facility={testFacilityV0} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('Should NOT render when facility has no services', () => {
    const testFacilityEmpty = {
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
    const testFacilityNoBenefits = {
      id: 'vba_313f',
      type: 'facility',
      attributes: {
        classification: 'Voc Rehab And Employment',
        facilityType: 'va_benefits_facility',
        id: 'vba_313f',
        services: {},
      },
    };
    let wrapper = shallow(<ServicesAtFacility facility={testFacilityEmpty} />);
    expect(wrapper.type()).equal(null);
    wrapper.unmount();
    wrapper = shallow(<ServicesAtFacility facility={testFacilityNoBenefits} />);
    expect(wrapper.type()).equal(null);
    wrapper.unmount();
  });
});
