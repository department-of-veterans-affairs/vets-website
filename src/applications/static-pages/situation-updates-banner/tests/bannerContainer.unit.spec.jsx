import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { mockApiRequest, mockLocation } from 'platform/testing/unit/helpers';

import { BannerContainer } from '../bannerContainer';
import {
  birmingham,
  birminghamWoContext,
  bostonTestWithBothCtAs,
  bostonTestWithJustFind,
  maine,
} from './mocks/mockSituationUpdatesBanner';

const getData = ({ isLoading = false, useBanners = true } = {}) => ({
  featureToggles: {
    loading: isLoading,
    bannerUseAlternativeBanners: useBanners,
    // eslint-disable-next-line camelcase
    banner_use_alternative_banners: useBanners,
  },
  subscribe: () => {},
  dispatch: () => {},
});

describe('featureToggles allow banners', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);
  let restoreLocation;

  afterEach(() => {
    restoreLocation?.();
  });

  it('should display the Birmingham banner', done => {
    restoreLocation = mockLocation(
      'http://localhost/birmingham-health-care/operating-status',
    );
    mockApiRequest(birmingham);
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(1);
      wrapper.unmount();
      done();
    }, 1000);
  });

  it('should display the Birmingham banner and display link even without context', done => {
    restoreLocation = mockLocation(
      'http://localhost/birmingham-health-care/locations/birmingham-va-medical-center',
    );
    mockApiRequest(birminghamWoContext);
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(1);
      const banner = wrapper.find('va-banner');
      const vaLink = banner.find('va-link');
      expect(vaLink).to.have.length(1);
      expect(vaLink.props().text).to.equal(
        'Get updates on affected services and facilities',
      );
      wrapper.unmount();
      done();
    }, 1500);
  });

  it('should display the Boston banner and display 1 link for find locations', done => {
    restoreLocation = mockLocation('http://localhost/boston-health-care');
    mockApiRequest(bostonTestWithJustFind);
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(1);
      const banner = wrapper.find('va-banner');
      const vaLink = banner.find('va-link');
      expect(vaLink).to.have.length(1);
      expect(vaLink.props().text).to.equal('Find other VA facilities near you');
      wrapper.unmount();
      done();
    }, 1500);
  });

  it('should display the Boston banner and display 2 links for find locations and updates', done => {
    restoreLocation = mockLocation('http://localhost/boston-health-care');
    mockApiRequest(bostonTestWithBothCtAs);
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(1);
      const banner = wrapper.find('va-banner');
      expect(banner.find('va-link')).to.have.length(2);
      wrapper.unmount();
      done();
    }, 1500);
  });

  it('should NOT display the Maine banner because toggles', done => {
    restoreLocation = mockLocation('http://localhost/maine-health-care');
    mockApiRequest(maine);
    const wrapper = mount(
      <Provider store={mockStore(getData({ useBanners: false }))}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(0);
      wrapper.unmount();
      done();
    }, 1000);
  });

  it('should NOT display the Faine banner because data does not exist', done => {
    restoreLocation = mockLocation('http://localhost/faine-health-care');
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(0);
      wrapper.unmount();
      done();
    }, 1000);
  });

  it('should display the Birmingham banner but accept with trailing slash', done => {
    restoreLocation = mockLocation('http://localhost/birmingham-health-care/');
    mockApiRequest(birmingham);
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(1);
      wrapper.unmount();
      done();
    }, 1000);
  });

  it('should accept accept manila-va-clinic but not display banner since none exists', done => {
    restoreLocation = mockLocation('http://localhost/manila-va-clinic/');
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(0);
      wrapper.unmount();
      done();
    }, 1000);
  });

  it('should not display and deal with vets-api error when vets-api fails on manila-va-clinic', done => {
    restoreLocation = mockLocation('http://localhost/manila-va-clinic/');
    mockApiRequest({ errors: 'some error' }, false);
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(0);
      wrapper.unmount();
      done();
    }, 1000);
  });

  it('should not display and deal with vets-api error when vets-api fails on health-care', done => {
    restoreLocation = mockLocation('http://localhost/boston-health-care/');
    mockApiRequest({ errors: 'some error' }, false);
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(0);
      wrapper.unmount();
      done();
    }, 1000);
  });

  it('should not display on some other page', done => {
    restoreLocation = mockLocation('http://localhost/some-other-page/');
    const wrapper = mount(
      <Provider store={mockStore(getData())}>
        <BannerContainer />
      </Provider>,
    );
    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find('va-banner')).to.have.length(0);
      wrapper.unmount();
      done();
    }, 1000);
  });
});
