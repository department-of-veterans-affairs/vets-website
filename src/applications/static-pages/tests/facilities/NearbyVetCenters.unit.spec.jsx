import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import NearbyVetCenters from '../../facilities/vet-center/NearByVetCenters';

const createFakeStore = state => {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
};

const publishedVetCenters = [
  {
    entity: {
      fieldFacilityLocatorApiId: 'vc_0441V',
      entityPublished: true,
      title: 'Green Bay Vet Center',
      entityBundle: 'vet_center',
      fieldOperatingStatusFacility: 'limited',
      fieldOperatingStatusMoreInfo:
        "We're currently open for limited in-person service, and screening all visitors for symptoms, due to the coronavirus COVID-19. For individual and group counseling, we recommend using our telehealth services. If you need to talk with someone confidentially, please call us anytime 24/7 at 877-927-8387.",
      fieldAddress: {
        locality: 'Green Bay',
        administrativeArea: 'WI',
        postalCode: '54304',
        addressLine1: '1600 South Ashland Avenue',
        organization: null,
      },
      fieldPhoneNumber: '920-435-5650',
      fieldMedia: null,
    },
  },
];

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
    expect(wrapper.find('LoadingIndicator').exists()).to.be.true;
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
    expect(wrapper.find('LoadingIndicator').exists()).to.be.false;
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

  it('should render published vet center if automate is false', () => {
    const state = {
      facility: { loading: false },
      featureToggles: {
        loading: false,
        [FEATURE_FLAG_NAMES.facilitiesVetCenterAutomateNearby]: false,
      },
    };
    const fakeStore = createFakeStore(state);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <NearbyVetCenters vetCenters={publishedVetCenters} />
      </Provider>,
    );
    expect(wrapper.find('h2').text()).to.equal('Other nearby Vet Centers');
    expect(wrapper.find('VetCenterInfoSection')).to.exist;
    expect(wrapper.find('ExpandableOperatingStatus')).to.exist;
    wrapper.unmount();
  });
});
