import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { mockApiRequest } from 'platform/testing/unit/helpers.js';
import * as mapboxUtils from 'applications/facility-locator/utils/mapbox';
import NearbyVetCenters from '../vet-center/NearByVetCenters';

const createFakeStore = state => {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
};

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

const mainVetCenterAddress = {
  countryCode: 'US',
  administrativeArea: 'MI',
  locality: 'Escanaba',
  postalCode: '49829',
  addressLine1: '3500 Ludington Street',
  addressLine2: 'Suite 110',
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

      const fakeMapboxResponse = { body: { features: [{ center: [0, 0] }] } };
      sinon
        .stub(mapboxUtils, 'getFeaturesFromAddress')
        .returns(fakeMapboxResponse);

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
        expect(wrapper.find('h2').text()).to.equal('Other nearby Vet Centers');
        expect(wrapper.find('h3').text()).to.equal('Automated Vet Center');
        expect(wrapper.find('VetCenterInfoSection')).to.exist;
        expect(wrapper.find('ExpandableOperatingStatus')).to.exist;
        wrapper.unmount();
        done();
      }, 0);
    });
  });
});
