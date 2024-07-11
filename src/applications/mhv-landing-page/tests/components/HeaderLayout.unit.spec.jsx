import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import HeaderLayout from '../../components/HeaderLayout';

const mockStore = ({ ssoe = false } = {}) => ({
  getState: () => ({
    featureToggles: {
      loading: false,
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
  describe('Health Tools links', () => {
    it('renders', async () => {
      const { getByText } = render(
        <Provider store={mockStore()}>
          <HeaderLayout />
        </Provider>,
      );
      await waitFor(() => {
        const result = getByText(/Welcome to the new home for My HealtheVet/);
        expect(result).to.exist;
      });
    });

    it('renders the non-ssoe link', async () => {
      const { getByTestId } = render(
        <Provider store={mockStore()}>
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
      const { getByTestId } = render(
        <Provider store={mockStore()}>
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
});
