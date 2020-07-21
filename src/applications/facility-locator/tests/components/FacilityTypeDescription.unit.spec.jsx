import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FacilityTypeDescription from '../../components/FacilityTypeDescription';
import { LocationType, FacilityType } from '../../constants';

describe('FacilityTypeDescription', () => {
  const vaLocationUrgentCare = {
    id: 'vha_519',
    attributes: {
      facilityType: FacilityType.VA_HEALTH_FACILITY,
    },
  };
  const vaBenefitsLocation = {
    id: 'vba_349l',
    attributes: {
      facilityType: FacilityType.VA_BENEFITS_FACILITY,
    },
  };
  const queryBenefits = { facilityType: LocationType.BENEFITS };

  it('should render with facility type VA benefits in facility page', () => {
    const wrapper = shallow(
      <FacilityTypeDescription
        location={vaBenefitsLocation}
        query={queryBenefits}
      />,
    );
    expect(wrapper.find('strong').text()).to.equal('Facility type:');
    expect(wrapper.find('p').text()).to.equal('Facility type: Benefits');
    wrapper.unmount();
  });

  it('should render with facility type VA benefits in search result', () => {
    const wrapper = shallow(
      <FacilityTypeDescription
        location={vaBenefitsLocation}
        query={queryBenefits}
        from={'SearchResult'}
      />,
    );
    expect(wrapper.find('p').text()).to.equal(
      LocationType.BENEFITS.toUpperCase(),
    );
    wrapper.unmount();
  });

  it('should render with facility type VA urgent care in search results ', () => {
    const queryUrgentCare = { facilityType: FacilityType.URGENT_CARE };
    const wrapper = shallow(
      <FacilityTypeDescription
        location={vaLocationUrgentCare}
        query={queryUrgentCare}
        from={'SearchResult'}
      />,
    );
    expect(wrapper.find('p').text()).to.equal('VA URGENT CARE');
    wrapper.unmount();
  });

  it('should render with facility type VA urgent care in facility page', () => {
    const queryUrgentCare = { facilityType: FacilityType.VA_HEALTH_FACILITY };
    const wrapper = shallow(
      <FacilityTypeDescription
        location={vaLocationUrgentCare}
        query={queryUrgentCare}
      />,
    );
    expect(wrapper.find('strong').text()).to.equal('Facility type:');
    expect(wrapper.find('p').text()).to.equal('Facility type: VA health');
    wrapper.unmount();
  });
});
