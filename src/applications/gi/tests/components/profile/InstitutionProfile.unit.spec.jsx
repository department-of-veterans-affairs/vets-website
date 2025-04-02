import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { waitFor } from '@testing-library/react';
import InstitutionProfile from '../../../components/profile/InstitutionProfile';
import { MINIMUM_RATING_COUNT } from '../../../constants';
import SchoolLocations from '../../../components/profile/SchoolLocations';

const mockStore = configureStore([]);

describe('<InstitutionProfile>', () => {
  it('should render ratings if rating count >= minimum', () => {
    const tree = shallow(
      <Provider store={mockStore({})}>
        <InstitutionProfile
          institution={{
            institutionRating: {
              institutionRatingCount: MINIMUM_RATING_COUNT,
              overallAvg: 2.5,
            },
          }}
        />
      </Provider>,
    );
    expect(tree.find('#veteran-ratings').length).to.eq(0);
    tree.unmount();
  });
  it('should not render ratings if rating count < minimum', () => {
    const tree = shallow(
      <Provider store={mockStore({})}>
        <InstitutionProfile
          institution={{
            institutionRating: {
              institutionRatingCount: MINIMUM_RATING_COUNT - 1,
              overallAvg: 2.5,
            },
          }}
        />
      </Provider>,
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
      <Provider store={mockStore({})}>
        <InstitutionProfile
          institution={mockInstitution}
          calculator={mockCalculator}
          eligibility={mockEligibility}
          constants={mockConstants}
          version={mockVersion}
          onViewLess={mockScrollToLocations}
        />
      </Provider>,
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
      <Provider store={mockStore({})}>
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
        />
      </Provider>,
    );

    expect(wrapper.find(SchoolLocations)).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('should show For information about VA flight benefits when institution type is Flight', async () => {
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
      <Provider store={mockStore({})}>
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
        />
      </Provider>,
    );

    const text = wrapper.find('.usa-width-three-fourths p');
    await waitFor(() => {
      expect(text).to.exist;
    });
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
      <Provider store={mockStore({})}>
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
        />
      </Provider>,
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
      <Provider
        store={mockStore({
          institution: {
            ...mockInstitution,
            facilityMap: facilityMapWithLocations,
          },
          calculator: mockCalculator,
          eligibility: mockEligibility,
          constants: mockConstants,
          version: mockVersion,
          onViewLess: mockScrollToLocations,
        })}
      >
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
        />
      </Provider>,
    );

    const text = wrapper.find('#calculate-your-benefits');
    expect(text).to.exist;
    wrapper.unmount();
  });
});
