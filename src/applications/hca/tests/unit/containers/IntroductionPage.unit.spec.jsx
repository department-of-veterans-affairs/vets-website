import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

describe('hca IntroductionPage', () => {
  const subject = ({
    isLoading = false,
    loaState = 3,
    loggedIn = true,
    hasError = false,
    hasESRecord = false,
    overrideEnabled = false,
    statusCode = null,
  } = {}) => {
    const props = {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    };
    const mockStore = {
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          hca_enrollment_status_override_enabled: overrideEnabled,
        },
        hcaEnrollmentStatus: {
          loading: isLoading,
          hasServerError: hasError,
          vesRecordFound: hasESRecord,
          statusCode,
        },
        form: {
          formId: formConfig.formId,
          data: {},
          loadedData: {
            metadata: {},
          },
          lastSavedDate: null,
          migrations: [],
          prefillTransformer: null,
        },
        user: {
          login: {
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            loading: false,
            loa: { current: loaState },
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
    };
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      enrollmentAlert: container.querySelector(
        '[data-testid="hca-enrollment-alert"]',
      ),
      identityAlert: container.querySelector(
        '[data-testid="hca-identity-alert"]',
      ),
      serverErrorAlert: container.querySelector(
        '[data-testid="hca-server-error-alert"]',
      ),
      vaLoadingIndicator: container.querySelector('va-loading-indicator'),
      vaOmbInfo: container.querySelector('va-omb-info'),
      vaProcessList: container.querySelector('va-process-list'),
    });
    return { selectors };
  };

  it('should render `va-loading-indicator` when enrollment status is loading', () => {
    const { selectors } = subject({ isLoading: true });
    expect(selectors().vaLoadingIndicator).to.exist;
  });

  it('should show identity verification alert when the user is LOA1 status', () => {
    const { selectors } = subject({ loaState: 1 });
    expect(selectors().identityAlert).to.exist;
  });

  it('should show process description when no enrollment record exists', () => {
    const { selectors } = subject();
    expect(selectors().vaProcessList).to.exist;
  });

  it('should show process description when override is enabled', () => {
    const { selectors } = subject({ hasESRecord: true, overrideEnabled: true });
    expect(selectors().vaProcessList).to.exist;
  });

  it('should show process description when user is logged out', () => {
    const { selectors } = subject({ loggedIn: false });
    const { vaOmbInfo, vaProcessList } = selectors();
    expect(vaProcessList).to.exist;
    expect(vaOmbInfo).to.exist;
  });

  it('should show enrollment status alert when record exists', () => {
    const { selectors } = subject({ hasESRecord: true });
    expect(selectors().enrollmentAlert).to.exist;
  });

  it('should show server error alert when error occurs', () => {
    const { selectors } = subject({ hasError: true });
    const { serverErrorAlert, vaOmbInfo } = selectors();
    expect(serverErrorAlert).to.exist;
    expect(vaOmbInfo).to.not.exist;
  });
});
