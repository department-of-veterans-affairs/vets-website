import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { mockApiRequest } from 'platform/testing/unit/helpers.js';
import * as mapboxUtils from 'applications/facility-locator/utils/mapbox';
import NearbyVetCenters from '../vet-center/NearByVetCenters';
import NearByVALocations from '../vet-center/NearByVALocations';
import VAFacilityInfoSection from '../vet-center/components/VAFacilityInfoSection';
import VAFacilityPhone, {
  processPhoneNumber,
} from '../vet-center/components/VAFacilityPhone';
import buildFacility from '../vet-center/buildFacility';

const createFakeStore = state => {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
};

const fakeMapboxResponse = { body: { features: [{ center: [0, 0] }] } };
sinon.stub(mapboxUtils, 'getFeaturesFromAddress').returns(fakeMapboxResponse);

const fetchedVetCenters = {
  data: [
    {
      id: 'vc_0441V',
      type: 'facility',
      attributes: {
        access: {},
        activeStatus: 'A',
        address: {
          mailing: {},
          physical: {
            zip: '54304',
            city: 'Green Bay',
            state: 'WI',
            address1: '1600 South Ashland Avenue',
            address2: null,
            address3: null,
          },
        },
        classification: null,
        detailedServices: null,
        facilityType: 'vet_center',
        feedback: {},
        hours: {
          friday: '800AM-430PM',
          monday: '800AM-430PM',
          sunday: 'Closed',
          tuesday: '800AM-430PM',
          saturday: 'Closed',
          thursday: '800AM-430PM',
          wednesday: '800AM-430PM',
        },
        id: 'vc_0441V',
        lat: 44.500671,
        long: -88.039521,
        mobile: false,
        name: 'Automated Vet Center',
        operatingStatus: {
          code: 'NORMAL',
        },
        operationalHoursSpecialInstructions: 'test',
        phone: {
          fax: '920-435-5086',
          main: '920-435-5650',
        },
        services: {},
        uniqueId: '0441V',
        visn: '12',
        website: null,
      },
    },
  ],
};
const fetchedVALocationsData = [
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
];

const mainVetCenterAddress = {
  countryCode: 'US',
  administrativeArea: 'MI',
  locality: 'Escanaba',
  postalCode: '49829',
  addressLine1: '3500 Ludington Street',
  addressLine2: 'Suite 110',
  organization: null,
};

const mainVALocationAddress = {
  countryCode: 'US',
  administrativeArea: 'OH',
  locality: 'Cleveland',
  postalCode: '44199',
  addressLine1: '1240 E. 9th Street, A.J. Celebrezze Federal Building',
  addressLine2: null,
  organization: null,
};

describe('NearbyVetCenters', () => {
  it('should render spinner while loading', () => {
    const state = {
      facility: { loading: true },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearbyVetCenters />
      </Provider>,
    );
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should not render spinner if not loading', () => {
    const state = {
      facility: { loading: false },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearbyVetCenters />
      </Provider>,
    );
    expect(wrapper.find('va-loading-indicator').exists()).to.be.false;
    wrapper.unmount();
  });

  it('should not render header with no vet centers', () => {
    const state = {
      facility: { loading: false },
      featureToggles: { loading: false },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearbyVetCenters />
      </Provider>,
    );
    expect(wrapper.find('h2').exists()).to.be.false;
    wrapper.unmount();
  });

  describe('automated', () => {
    const automatedState = {
      facility: { loading: false },
      featureToggles: {
        loading: false,
      },
    };

    it('should render auto-fetched vet center', done => {
      const fakeStore = createFakeStore(automatedState);
      mockApiRequest(fetchedVetCenters);

      const wrapper = mount(
        <Provider store={fakeStore}>
          <NearbyVetCenters
            mainVetCenterAddress={mainVetCenterAddress}
            mainVetCenterId="vc_0434V"
            mainVetCenterPhone="906-233-0244"
          />
        </Provider>,
      );

      // wait for useEffect
      setTimeout(() => {
        wrapper.update();
        expect(wrapper.find('h3').text()).to.equal('Automated Vet Center');
        expect(wrapper.find('VetCenterInfoSection')).to.exist;
        expect(wrapper.find('ExpandableOperatingStatus')).to.exist;
        wrapper.unmount();
        done();
      }, 0);
    });
  });
});
describe('NearbyVALocations', () => {
  it('should render spinner while any subset of multiLoading is loading', () => {
    const state = {
      facility: {
        multiLoading: { Health: true, VetCenter: false, Cemetery: false },
        multidata: { Health: {}, VetCenter: {}, Cemetery: {} },
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
        multidata: {
          Health: { data: [] },
          VetCenter: { data: [] },
          Cemetery: { data: [] },
        },
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

  it('should render text for no data found', () => {
    const state = {
      facility: {
        multiLoading: { Health: false, VetCenter: false, Cemetery: false },
        multidata: {
          Health: { data: [] },
          VetCenter: { data: [] },
          Cemetery: { data: [] },
        },
      },
      featureToggles: { loading: false },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearByVALocations />
      </Provider>,
    );
    expect(wrapper.find('p').text()).to.equal('No nearby VA locations found.');
    wrapper.unmount();
  });

  describe('automated', () => {
    const automatedState = {
      facility: {
        multiLoading: { Health: false, VetCenter: false, Cemetery: false },
        multidata: {
          Health: {
            data: fetchedVALocationsData.map(d => ({ ...d, source: 'Health' })),
          },
          VetCenter: {
            data: [],
          },
          Cemetery: {
            data: [],
          },
        },
      },
      featureToggles: {
        loading: false,
      },
    };

    it('should render auto-fetched VA Facility', done => {
      const fakeStore = createFakeStore(automatedState);
      mockApiRequest({ data: fetchedVALocationsData });

      const wrapper = mount(
        <Provider store={fakeStore}>
          <NearByVALocations
            mainAddress={mainVALocationAddress}
            mainFacilityApiId="vba_325"
            mainPhone="800-827-1000"
          />
        </Provider>,
      );

      // wait for useEffect
      setTimeout(() => {
        wrapper.update();
        const el = wrapper.find('va-link').first();
        const props = el.props();
        expect(props).to.deep.equal({
          href:
            'https://www.va.gov/northeast-ohio-health-care/locations/cleveland-va-clinic-euclid/',
          text: 'Cleveland VA Clinic-Euclid',
        });
        wrapper.unmount();
        done();
      }, 100);
    });
  });
});
describe('VAFacilityInfoSection', () => {
  it('should render VAFacilityInfoSection', () => {
    const mainPhone = '800-827-1000';
    const vaFacility = buildFacility(fetchedVALocationsData[0], 3);
    const wrapper = mount(
      <VAFacilityInfoSection mainPhone={mainPhone} vaFacility={vaFacility} />,
    );
    // not a Vet Center CAP so mainPhone is not used
    expect(wrapper.find('h3').exists()).to.be.true;
    expect(wrapper.find('strong').exists()).to.be.true;
    const telephone = wrapper.find('va-telephone');
    const telephoneProps = telephone.props();
    expect(telephoneProps).to.deep.equal({
      contact: '216-391-0264',
      extension: '',
      'message-aria-describedby': 'Main number',
    });

    wrapper.unmount();
  });
});
describe('VAFacilityPhone', () => {
  it('should render VAFacilityPhone with a phone number title', () => {
    const wrapper = mount(
      <VAFacilityPhone phoneNumber="301-000-0000" phoneTitle="Main number" />,
    );
    expect(wrapper.find('strong').exists()).to.be.true;
    const telephone = wrapper.find('va-telephone');
    const telephoneProps = telephone.props();
    expect(telephoneProps).to.deep.equal({
      contact: '301-000-0000',
      extension: '',
      'message-aria-describedby': 'Main number',
    });
    wrapper.unmount();
  });
  it('should render VAFacilityPhone with NO phone number title', () => {
    const wrapper = mount(<VAFacilityPhone phoneNumber="301-000-0000" />);
    expect(wrapper.find('strong').exists()).to.be.false;
    const telephone = wrapper.find('va-telephone');
    const telephoneProps = telephone.props();
    expect(telephoneProps).to.deep.equal({
      contact: '301-000-0000',
      extension: '',
    });
    wrapper.unmount();
  });
});
describe('processPhoneNumber', () => {
  it('should process phone number strings into phone and extension', () => {
    const phoneNumber = '800-827-1000';
    const extension = '123';
    const phoneConditions = [
      '',
      'x',
      ' ext ',
      ' ext. ',
      ' x. ',
      ', x',
      ', ext',
      ', ext.',
      ', ext. ',
    ]
      // For all cases except the first, concatenate the phoneNumber, extension separator, and extension
      .map((e, i) => (i === 0 ? phoneNumber : phoneNumber + e + extension));
    for (let i = 0; i < phoneConditions.length; i += 1) {
      const processed = processPhoneNumber(phoneConditions[i]);
      if (i === 0) {
        expect(processed).to.deep.equal({
          phone: phoneNumber,
          ext: '',
          processed: true,
        });
      } else {
        expect(processed).to.deep.equal({
          phone: phoneNumber,
          ext: extension,
          processed: true,
        });
      }
    }
  });
});
