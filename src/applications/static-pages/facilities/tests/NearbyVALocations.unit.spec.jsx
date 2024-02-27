import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { mockApiRequest } from 'platform/testing/unit/helpers.js';
import * as mapboxUtils from 'applications/facility-locator/utils/mapbox';
import NearByVALocations from '../vet-center/NearByVALocations';

const createFakeStore = state => {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
};

const fetchedVALocations = {
  data: [
    {
      id: 'vha_541QB',
      type: 'facility',
      attributes: {
        access: {
          health: [
            {
              service: 'MentalHealthCare',
              new: 47,
              established: 2,
            },
            {
              service: 'PrimaryCare',
              new: 7,
              established: 8,
            },
          ],
          effectiveDate: '2024-02-25',
        },
        activeStatus: 'A',
        address: {
          mailing: {},
          physical: {
            zip: '44103-4014',
            city: 'Cleveland',
            state: 'OH',
            address1: '7000 Euclid Avenue',
            address2: null,
            address3: 'Suites 102 and 202',
          },
        },
        classification: 'Primary Care CBOC',
        detailedServices: [],
        facilityType: 'va_health_facility',
        feedback: {
          health: {
            primaryCareUrgent: 0,
            primaryCareRoutine: 0,
          },
          effectiveDate: '2022-06-28',
        },
        hours: {
          friday: '500AM-530PM',
          monday: '500AM-530PM',
          sunday: 'Closed',
          tuesday: '500AM-530PM',
          saturday: '500AM-530PM',
          thursday: '500AM-530PM',
          wednesday: '500AM-530PM',
        },
        id: 'vha_541QB',
        lat: 41.503689,
        long: -81.6410655,
        mobile: false,
        name: 'Cleveland VA Clinic-Euclid',
        operatingStatus: {
          code: 'LIMITED',
          additionalInfo:
            'Regular office hours are 8 a.m. to 4:30 p.m. ET, Monday through Friday.',
        },
        operationalHoursSpecialInstructions: null,
        phone: {
          fax: '216-391-0265',
          main: '216-391-0264',
          pharmacy: '216-791-2300 x62001',
          afterHours: '216-391-0264',
          patientAdvocate: '216-791-3800 x61700',
          enrollmentCoordinator: '216-791-3800 x63576',
          healthConnect: null,
        },
        services: {
          other: [],
          health: ['MentalHealthCare', 'Podiatry', 'PrimaryCare'],
          lastUpdated: '2024-02-25',
        },
        uniqueId: '541QB',
        visn: '10',
        website:
          'https://www.va.gov/northeast-ohio-health-care/locations/cleveland-va-clinic-euclid/',
      },
    },
    {
      id: 'vha_541GM',
      type: 'facility',
      attributes: {
        access: {
          health: [],
          effectiveDate: null,
        },
        activeStatus: 'A',
        address: {
          mailing: {},
          physical: {
            zip: '44106',
            city: 'Cleveland',
            state: 'OH',
            address1: '8901 Superior Avenue',
            address2: null,
            address3: null,
          },
        },
        classification: 'Other Outpatient Services (OOS)',
        detailedServices: [],
        facilityType: 'va_health_facility',
        feedback: {
          health: {},
          effectiveDate: null,
        },
        hours: {
          friday: '730AM-500PM',
          monday: '730AM-500PM',
          sunday: 'Closed',
          tuesday: '730AM-500PM',
          saturday: 'Closed',
          thursday: '730AM-500PM',
          wednesday: '730AM-500PM',
        },
        id: 'vha_541GM',
        lat: 41.52075514,
        long: -81.62566982,
        mobile: false,
        name: 'Cleveland VA Clinic-Superior',
        operatingStatus: {
          code: 'NORMAL',
        },
        operationalHoursSpecialInstructions: null,
        phone: {
          fax: '216-421-3134',
          main: '216-421-3133',
          pharmacy: '216-791-3800 x62001',
          afterHours: '216-791-3800 x64441',
          patientAdvocate: '216-791-3800 x61700',
          enrollmentCoordinator: '216-791-3800 x65189',
          healthConnect: null,
        },
        services: {
          other: [],
          health: [],
          lastUpdated: null,
        },
        uniqueId: '541GM',
        visn: '10',
        website:
          'https://www.va.gov/northeast-ohio-health-care/locations/cleveland-va-clinic-superior/',
      },
    },
  ],
};

const mainVetCenterAddress = {
  countryCode: 'US',
  administrativeArea: 'OH',
  locality: 'Cleveland',
  postalCode: '44199',
  addressLine1: '1240 E. 9th Street, A.J. Celebrezze Federal Building',
  addressLine2: null,
  organization: null,
};

describe('NearbyVetCenters', () => {
  it('should render spinner while any subset of multiLoading is loading', () => {
    const state = {
      facility: {
        multiLoading: { Health: true, VetCenter: false, Cemetery: false },
      },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearByVALocations />
      </Provider>,
    );
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should not render spinner if not loading', () => {
    const state = {
      facility: {
        multiLoading: { Health: false, VetCenter: false, Cemetery: false },
      },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearByVALocations />
      </Provider>,
    );
    expect(wrapper.find('va-loading-indicator').exists()).to.be.false;
    wrapper.unmount();
  });

  it('should not render header with no vet centers', () => {
    const state = {
      facility: {
        multiLoading: { Health: false, VetCenter: false, Cemetery: false },
      },
      featureToggles: { loading: false },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearByVALocations />
      </Provider>,
    );
    expect(wrapper.find('h2').exists()).to.be.false;
    wrapper.unmount();
  });

  describe('automated', () => {
    const automatedState = {
      facility: {
        multiLoading: { Health: false, VetCenter: false, Cemetery: false },
      },
      featureToggles: {
        loading: false,
      },
    };

    it('should render auto-fetched vet center', done => {
      const fakeStore = createFakeStore(automatedState);
      mockApiRequest(fetchedVALocations);

      const fakeMapboxResponse = { body: { features: [{ center: [0, 0] }] } };
      sinon
        .stub(mapboxUtils, 'getFeaturesFromAddress')
        .returns(fakeMapboxResponse);

      const wrapper = mount(
        <Provider store={fakeStore}>
          <NearByVALocations
            mainAddress={mainVetCenterAddress}
            mainFacilityApiId="vba_325"
            mainPhone="800-827-1000"
          />
        </Provider>,
      );

      // wait for useEffect
      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find('h2').text()).to.equal('Other nearby VA locations');
        expect(
          wrapper
            .find('h4')
            .first() // it does 3 requests and gets back 1 facility (that is the mock) for Health, VetCenter, and Cemetery
            .text(),
        ).to.equal('Cleveland VA Clinic-Euclid');
        wrapper.unmount();
        done();
      }, 100);
    });
  });
});
