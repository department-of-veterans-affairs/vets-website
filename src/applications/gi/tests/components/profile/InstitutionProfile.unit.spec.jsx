import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Sinon from 'sinon';
import InstitutionProfile from '../../../components/profile/InstitutionProfile';
import { MINIMUM_RATING_COUNT } from '../../../constants';
import SchoolLocations from '../../../components/profile/SchoolLocations';

describe('<InstitutionProfile>', () => {
  it('should render ratings if rating count >= minimum', () => {
    const tree = shallow(
      <InstitutionProfile
        institution={{
          institutionRating: {
            institutionRatingCount: MINIMUM_RATING_COUNT,
            overallAvg: 2.5,
          },
        }}
      />,
    );
    expect(tree.find('#veteran-ratings').length).to.eq(1);
    tree.unmount();
  });
  it('should not render ratings if rating count < minimum', () => {
    const tree = shallow(
      <InstitutionProfile
        institution={{
          institutionRating: {
            institutionRatingCount: MINIMUM_RATING_COUNT - 1,
            overallAvg: 2.5,
          },
        }}
      />,
    );
    expect(tree.find('#veteran-ratings').length).to.eq(0);
    tree.unmount();
  });
  it('does not render <SchoolLocations /> when there are no extensions or branches', () => {
    const mockCalculator = () => {};
    const mockEligibility = {};
    const mockConstants = {};
    const mockVersion = '1.0.0';
    const mockScrollToLocations = Sinon.stub();
    const mockFacilityMap = {
      main: {
        extensions: [],
        branches: [],
      },
    };

    const mockInstitution = {
      facilityMap: mockFacilityMap,
    };
    const wrapper = shallow(
      <InstitutionProfile
        institution={mockInstitution}
        calculator={mockCalculator}
        eligibility={mockEligibility}
        constants={mockConstants}
        version={mockVersion}
        onViewLess={mockScrollToLocations}
      />,
    );

    expect(wrapper.find(SchoolLocations)).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('renders <SchoolLocations /> when there are extensions or branches', () => {
    const mockCalculator = () => {};
    const mockEligibility = {};
    const mockConstants = {};
    const mockVersion = '1.0.0';
    const mockScrollToLocations = Sinon.stub();
    const mockFacilityMap = {
      main: {
        extensions: [],
        branches: [],
      },
    };

    const mockInstitution = {
      facilityMap: mockFacilityMap,
    };
    const facilityMapWithLocations = {
      ...mockFacilityMap,
      main: {
        extensions: [],
        branches: [],
      },
    };
    const wrapper = shallow(
      <InstitutionProfile
        institution={{
          ...mockInstitution,
          facilityMap: facilityMapWithLocations,
        }}
        calculator={mockCalculator}
        eligibility={mockEligibility}
        constants={mockConstants}
        version={mockVersion}
        onViewLess={mockScrollToLocations}
      />,
    );

    expect(wrapper.find(SchoolLocations)).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('should show For information about VA flight benefits when institution type is Flight', () => {
    const mockCalculator = () => {};
    const mockEligibility = {};
    const mockConstants = {};
    const mockVersion = '1.0.0';
    const mockScrollToLocations = Sinon.stub();
    const mockFacilityMap = {
      main: {
        extensions: [],
        branches: [],
      },
    };

    const mockInstitution = {
      type: 'FLIGHT',
      facilityMap: mockFacilityMap,
    };
    const facilityMapWithLocations = {
      ...mockFacilityMap,
      main: {
        extensions: [],
        branches: [],
      },
    };
    const wrapper = shallow(
      <InstitutionProfile
        institution={{
          ...mockInstitution,
          facilityMap: facilityMapWithLocations,
        }}
        calculator={mockCalculator}
        eligibility={mockEligibility}
        constants={mockConstants}
        version={mockVersion}
        onViewLess={mockScrollToLocations}
      />,
    );

    const text = wrapper.find('.usa-width-three-fourths p');
    expect(text.text()).to.equal(
      'For information about VA flight benefits, visit Please contact a School Certifying Official listed under the Contact information at the bottom of this page to discuss benefits available.',
    );
    wrapper.unmount();
  });
  it('should not show Calculate your benefits section from school details when institution type is Flight', () => {
    const mockCalculator = () => {};
    const mockEligibility = {};
    const mockConstants = {};
    const mockVersion = '1.0.0';
    const mockScrollToLocations = Sinon.stub();
    const mockFacilityMap = {
      main: {
        extensions: [],
        branches: [],
      },
    };

    const mockInstitution = {
      type: 'FLIGHT',
      facilityMap: mockFacilityMap,
    };
    const facilityMapWithLocations = {
      ...mockFacilityMap,
      main: {
        extensions: [],
        branches: [],
      },
    };
    const wrapper = shallow(
      <InstitutionProfile
        institution={{
          ...mockInstitution,
          facilityMap: facilityMapWithLocations,
        }}
        calculator={mockCalculator}
        eligibility={mockEligibility}
        constants={mockConstants}
        version={mockVersion}
        onViewLess={mockScrollToLocations}
      />,
    );

    const text = wrapper.find('#calculate-your-benefits');
    expect(text).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('should show Calculate your benefits section from school details when institution type not is Flight', () => {
    const mockCalculator = () => {};
    const mockEligibility = {};
    const mockConstants = {};
    const mockVersion = '1.0.0';
    const mockScrollToLocations = Sinon.stub();
    const mockFacilityMap = {
      main: {
        extensions: [],
        branches: [],
      },
    };

    const mockInstitution = {
      type: 'PUBLIC',
      facilityMap: mockFacilityMap,
    };
    const facilityMapWithLocations = {
      ...mockFacilityMap,
      main: {
        extensions: [],
        branches: [],
      },
    };
    const wrapper = shallow(
      <InstitutionProfile
        institution={{
          ...mockInstitution,
          facilityMap: facilityMapWithLocations,
        }}
        calculator={mockCalculator}
        eligibility={mockEligibility}
        constants={mockConstants}
        version={mockVersion}
        onViewLess={mockScrollToLocations}
      />,
    );

    const text = wrapper.find('#calculate-your-benefits');
    expect(text).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
