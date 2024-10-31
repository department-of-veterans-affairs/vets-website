import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
    userLoggedIn: false,
    userIdVerified: true,
  },
};

describe('introduction page', () => {
  describe('loading indicator', () => {
    const loadingStore = (profileLoading = false, mdotPending = false) => ({
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            loading: profileLoading,
          },
        },
        mdot: {
          isError: false,
          pending: mdotPending,
          data: null,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    });

    it('on for user profile loading', () => {
      const { getByTestId } = render(
        <Provider store={loadingStore(true, false)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByTestId('mhv-supply-intro-reorder-loading');
    });

    it('on for MDOT pending', () => {
      const { getByTestId } = render(
        <Provider store={loadingStore(false, true)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByTestId('mhv-supply-intro-reorder-loading');
    });

    it('on for both MDOT pending and profile loading', () => {
      const { getByTestId } = render(
        <Provider store={loadingStore(true, true)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByTestId('mhv-supply-intro-reorder-loading');
    });

    it('off for if nothing is loading or pending', () => {
      const { queryByTestId } = render(
        <Provider store={loadingStore(false, false)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      expect(queryByTestId('mhv-supply-intro-reorder-loading')).to.be.null;
    });
  });

  describe('show error', () => {
    const errorStore = (mdotError = false, eligible = false) => ({
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            loading: false,
          },
        },
        mdot: {
          isError: mdotError,
          errorCode: 'MDOT_INVALID',
          pending: false,
          data: {
            eligibility: {
              accessories: eligible,
              apneas: eligible,
              batteries: eligible,
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    });

    it('mdot error', () => {
      const { getByTestId } = render(
        <Provider store={errorStore(true, false)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByTestId('mhv-supply-intro-error');
    });

    it('ineligible error', () => {
      const { getByTestId, queryByTestId } = render(
        <Provider store={errorStore(false, false)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      expect(queryByTestId('mhv-supply-intro-error')).to.be.null;
      getByTestId('mhv-supply-intro-ineligible');
    });

    it('no error', () => {
      const { getByTestId, queryByTestId } = render(
        <Provider store={errorStore(false, true)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      expect(queryByTestId('mhv-supply-intro-error')).to.be.null;
      expect(queryByTestId('mhv-supply-intro-ineligible')).to.be.null;
      getByTestId('mhv-supply-intro-content');
    });
  });

  describe('veteran is eligible', () => {
    const noAvailableSuppliesHeading = /You have no available supplies to reorder/;
    const dataStore = (supplies = []) => ({
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            loading: false,
            savedForms: [],
            prefillsAvailable: [],
          },
        },
        form: {
          formId: formConfig.formId,
          loadedStatus: 'success',
          savedStatus: '',
          loadedData: {
            metadata: {},
          },
          data: {},
        },
        mdot: {
          isError: false,
          errorCode: '',
          pending: false,
          data: {
            eligibility: {
              accessories: true,
              apneas: true,
              batteries: true,
            },
            supplies,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    });

    const unavailSuppliesList = [
      {
        productName: 'AIRCURVE10-ASV-CLIMATELINE',
        productGroup: 'Apnea',
        productId: 8467,
        lastOrderDate: '2022-07-06',
        nextAvailabilityDate: '2022-12-06',
        quantity: 1,
      },
    ];

    const availSuppliesList = [
      {
        productName: 'ERHK HE11 680 MINI',
        productGroup: 'Accessory',
        productId: 6584,
        availableForReorder: true,
        lastOrderDate: '2022-05-16',
        nextAvailabilityDate: '2022-10-16',
        quantity: 5,
      },
      {
        productName: 'AIRFIT P10',
        productGroup: 'Apnea',
        productId: 6650,
        availableForReorder: true,
        lastOrderDate: '2022-07-05',
        nextAvailabilityDate: '2022-12-05',
        quantity: 1,
      },
    ];

    it('but has no supplies to reorder', () => {
      // Note the API will always return supplies for eligible veterans,
      // but we test the code anyways
      const { getByTestId, getByRole, queryByTestId } = render(
        <Provider store={dataStore()}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByTestId('mhv-supply-intro-content');
      getByRole('heading', {
        name: noAvailableSuppliesHeading,
      });
      expect(queryByTestId('mhv-supply-intro-unavail-card')).to.be.null;
    });

    it('and has only unavailable supplies', () => {
      const { getByTestId, getByRole, queryByTestId } = render(
        <Provider store={dataStore(unavailSuppliesList)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByTestId('mhv-supply-intro-content');
      getByRole('heading', {
        name: noAvailableSuppliesHeading,
      });
      expect(queryByTestId('mhv-supply-intro-unavail-card')).to.not.be.null;
    });

    it('and has only one available supply', () => {
      const { getByTestId, getByRole, queryByTestId, getByText } = render(
        <Provider store={dataStore([availSuppliesList[0]])}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByTestId('mhv-supply-intro-content');
      getByRole('heading', {
        name: noAvailableSuppliesHeading,
        hidden: true,
      });
      expect(queryByTestId('mhv-supply-intro-unavail-card')).to.be.null;
      getByRole('heading', { name: /Available for reorder/ });
      getByText(/You have 1 supply available/);
    });

    it('and has more than one available supply', () => {
      const { getByRole, getByText } = render(
        <Provider store={dataStore(availSuppliesList)}>
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByRole('heading', { name: /Available for reorder/ });
      getByText(
        new RegExp(`You have ${availSuppliesList.length} supplies available`),
      );
    });

    it('and has both available and unavailable supplies', () => {
      const { getByRole } = render(
        <Provider
          store={dataStore([...availSuppliesList, ...unavailSuppliesList])}
        >
          <IntroductionPage {...props} />
        </Provider>,
      );
      getByRole('heading', { name: /Available for reorder/ });
      getByRole('heading', {
        name: noAvailableSuppliesHeading,
      });
    });
  });
});
