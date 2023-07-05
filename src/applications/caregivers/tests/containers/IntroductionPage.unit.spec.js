import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

describe('CG <IntroductionPage>', () => {
  const getData = ({ useFacilitiesAPI = false } = {}) => ({
    props: {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    },
    mockStore: {
      getState: () => ({
        featureToggles: {
          useFacilitiesAPI,
        },
        form: {
          formId: formConfig.formId,
          data: {},
          loadedData: {
            metadata: {},
          },
          lastSavedDate: null,
          migrations: [],
        },
        user: {
          login: {
            currentlyLoggedIn: false,
          },
          profile: {
            loading: false,
            loa: { current: null },
            savedForms: [],
            prefillsAvailable: [],
          },
        },
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: {
            get: () => {},
          },
          dismissedDowntimeWarnings: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  it('should render', () => {
    const { mockStore, props } = getData();
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selectors = {
      wrapper: view.container.querySelector('.caregivers-intro'),
      title: view.container.querySelector('[data-testid="form-title"]'),
      intro: view.container.querySelector('.va-introtext'),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.title).to.contain.text(
      'Apply for the Program of Comprehensive Assistance for Family Caregivers',
    );
    expect(selectors.intro).to.contain.text(
      'We recognize the important role of family caregivers in supporting the health and wellness of Veterans.',
    );
  });

  it('should contain links to start the application', () => {
    const { mockStore, props } = getData();
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = view.container.querySelectorAll('[href="#start"]');
    expect(selector).to.have.lengthOf(2);
  });

  it('should contain the process timeline for steps to get started with the application', () => {
    const { mockStore, props } = getData();
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = view.container.querySelector('.schemaform-process');
    expect(selector).to.exist;
  });

  it('should contain the OMB info for this application', () => {
    const { mockStore, props } = getData();
    const view = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selector = view.container.querySelector('va-omb-info');
    expect(selector).to.exist;
    expect(selector).to.have.attribute('res-burden', '15');
    expect(selector).to.have.attribute('omb-number', '2900-0768');
    expect(selector).to.have.attribute('exp-date', '04/30/2024');
  });
});
