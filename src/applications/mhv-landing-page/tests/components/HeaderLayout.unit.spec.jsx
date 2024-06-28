import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import HeaderLayout from '../../components/HeaderLayout';

const mockStore = ({
  mhvLandingPageEnableVaGovHealthToolsLinks = false,
  ssoe = false,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      loading: false,
      mhvLandingPageEnableVaGovHealthToolsLinks,
      // eslint-disable-next-line camelcase
      mhv_landing_page_enable_va_gov_health_tools_links: mhvLandingPageEnableVaGovHealthToolsLinks,
    },
    user: {
      profile: {
        session: {
          ssoe,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('MHV Landing Page -- Header Layout', () => {
  describe('Health Tools links -- feature toggle enabled', () => {
    it('shows the new content when mhvLandingPageEnableVaGovHealthToolsLinks is true', async () => {
      const store = mockStore({
        mhvLandingPageEnableVaGovHealthToolsLinks: true,
      });
      const { getByText } = render(
        <Provider store={store}>
          <HeaderLayout />
        </Provider>,
      );
      await waitFor(() => {
        const result = getByText(/Welcome to the new home for My HealtheVet/);
        expect(result).to.exist;
      });
    });

    it('renders the non-ssoe link', async () => {
      const store = mockStore({
        mhvLandingPageEnableVaGovHealthToolsLinks: true,
      });
      const { getByTestId } = render(
        <Provider store={store}>
          <HeaderLayout />
        </Provider>,
      );
      await waitFor(() => {
        const goBack1 = getByTestId('mhv-go-back-1');
        expect(goBack1).to.have.attribute(
          'href',
          'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
        );

        const goBack2 = getByTestId('mhv-go-back-2');
        expect(goBack2).to.have.attribute(
          'href',
          'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
        );
      });
    });

    it('renders the ssoe link', async () => {
      const store = mockStore({
        mhvLandingPageEnableVaGovHealthToolsLinks: true,
        ssoe: true,
      });
      const { getByTestId } = render(
        <Provider store={store}>
          <HeaderLayout />
        </Provider>,
      );
      await waitFor(() => {
        const goBack1 = getByTestId('mhv-go-back-1');
        expect(goBack1).to.have.attribute(
          'href',
          'https://int.eauth.va.gov/mhv-portal-web/eauth',
        );

        const goBack2 = getByTestId('mhv-go-back-2');
        expect(goBack2).to.have.attribute(
          'href',
          'https://int.eauth.va.gov/mhv-portal-web/eauth',
        );
      });
    });
  });

  describe('Go back links', () => {
    it('call datadogRum.addAction on click of go-back links', async () => {
      const store = mockStore({
        mhvLandingPageEnableVaGovHealthToolsLinks: true,
      });
      const { getByTestId } = render(
        <Provider store={store}>
          <HeaderLayout />
        </Provider>,
      );

      const spyDog = sinon.spy(datadogRum, 'addAction');

      await waitFor(() => {
        const goBack1 = getByTestId('mhv-go-back-1');
        fireEvent.click(goBack1);

        expect(spyDog.called).to.be.true;

        const goBack2 = getByTestId('mhv-go-back-2');
        fireEvent.click(goBack2);

        expect(spyDog.calledTwice).to.be.true;

        spyDog.restore();
      });
    });
  });

  describe('Health Tools links -- feature toggle disabled', () => {
    it('shows the old content when mhvLandingPageEnableVaGovHealthToolsLinks is false', async () => {
      const store = mockStore({
        mhvLandingPageEnableVaGovHealthToolsLinks: false,
      });
      const { getByText } = render(
        <Provider store={store}>
          <HeaderLayout />
        </Provider>,
      );
      await waitFor(() => {
        const result = getByText(/Learn more about My HealtheVet on VA.gov/);
        expect(result).to.exist;
      });
    });
  });
});
