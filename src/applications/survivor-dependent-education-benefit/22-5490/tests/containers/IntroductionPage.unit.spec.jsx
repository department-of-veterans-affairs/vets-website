import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import IntroductionPage from '../../containers/IntroductionPage';
import formConfig from '../../config/form';

describe('<IntroductionPage>', () => {
  const selectors = {
    wrapper: '.schemaform-intro',
    title: '[data-testid="form-title"]',
    introText: 'strong', // Selecting the introductory <strong> tag in the paragraph
    processTimeline: 'va-process-list',
    ombInfo: 'va-omb-info',
    startButton: '[data-testid="start-button"]', // Make sure to add `data-testid="start-button"` in the component
  };

  const getData = ({
    isLoggedIn = false,
    isLOA3 = false,
    isMinor = false,
    isPersonalInfoFetchFailed = false,
    showMeb5490MaintenanceAlert = false,
  } = {}) => ({
    props: {
      route: {
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
        formConfig: {
          prefillEnabled: true,
          savedFormMessages: ['Your form is saved.'],
        },
      },
      router: {
        push: sinon.spy(),
      },
      isLoggedIn,
      isLOA3,
      isMinor,
      isPersonalInfoFetchFailed,
      showMeb5490MaintenanceAlert,
    },
    mockStore: {
      getState: () => ({
        form: {
          formId: formConfig.formId,
          data: {
            claimantDateOfBirth: isMinor ? '2010-01-01' : '1990-01-01',
          },
          loadedData: {
            metadata: {},
          },
          lastSavedDate: null,
          migrations: [],
        },
        user: {
          login: {
            currentlyLoggedIn: isLoggedIn,
          },
          profile: {
            loading: false,
            loa: { current: isLOA3 ? 3 : null },
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
        data: {
          isPersonalInfoFetchFailed,
        },
        featureToggles: {
          showMeb5490MaintenanceAlert,
          mebBlockUnder18: isMinor,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  const renderComponent = ({ mockStore, props }) =>
    render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

  context('when the page renders', () => {
    it('should contain the correct page title and introductory text', () => {
      const { mockStore, props } = getData();
      const { container, getByText } = renderComponent({ mockStore, props });

      expect(container.querySelector(selectors.wrapper)).to.exist;
      expect(getByText('Apply for education benefits as an eligible dependent'))
        .to.exist;
      expect(
        getByText(
          "Form 22-5490 (Dependents' Application for VA Education Benefits)",
        ),
      ).to.exist;
      expect(container.querySelector(selectors.introText)).to.exist;
    });

    it('should contain the process timeline for steps to get started with the application', () => {
      const { mockStore, props } = getData();
      const { container } = renderComponent({ mockStore, props });
      expect(container.querySelector(selectors.processTimeline)).to.exist;
    });
  });

  context('conditional rendering tests', () => {
    it('should not show the start button if maintenance alert is active', () => {
      const { mockStore, props } = getData({
        isLoggedIn: true,
        isLOA3: true,
        showMeb5490MaintenanceAlert: true,
      }); // Enable maintenance alert
      const { container } = renderComponent({ mockStore, props });
      const startButton = container.querySelector(selectors.startButton);
      expect(startButton).to.not.exist;
    });

    it('should not show the start button if user is not LOA3', () => {
      const { mockStore, props } = getData({ isLoggedIn: true, isLOA3: false }); // Set LOA3 to false
      const { container } = renderComponent({ mockStore, props });
      const startButton = container.querySelector(selectors.startButton);
      expect(startButton).to.not.exist;
    });

    it('should show warning alert instead of start link when user is a minor', () => {
      const { mockStore, props } = getData({
        isLoggedIn: true,
        isLOA3: true,
        isMinor: true,
      });
      const screen = renderComponent({ mockStore, props });
      expect(
        screen.getByText(
          'You don’t meet the age requirement to access this form online',
        ),
      ).to.exist;
    });
  });
});
