import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import { BannerContainer } from '../bannerContainer';
import {
  birmingham,
  birminghamWoContext,
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

  it('should display the Birmingham banner', done => {
    sinon
      .stub(window, 'location')
      .value({ pathname: '/birmingham-health-care/operating-status' });
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
    sinon.stub(window, 'location').value({
      pathname:
        '/birmingham-health-care/locations/birmingham-va-medical-center',
    });
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
      expect(banner.find('va-link')).to.have.length(1);
      wrapper.unmount();
      done();
    }, 1500);
  });

  it('should NOT display the Maine banner because toggles', done => {
    sinon.stub(window, 'location').value({ pathname: '/maine-health-care' });
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
    sinon.stub(window, 'location').value({ pathname: '/faine-health-care' });
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
    sinon
      .stub(window, 'location')
      .value({ pathname: '/birmingham-health-care/' });
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
    sinon.stub(window, 'location').value({ pathname: '/manila-va-clinic/' });
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
