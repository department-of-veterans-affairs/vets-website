import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

// Import modules to stub
import * as datadogExports from 'platform/monitoring/Datadog/';
import * as featureToggleExports from 'platform/utilities/feature-toggles';
import * as redirectExports from '../../utils/redirect';

import App from '../../containers/App';

let sandbox;

describe('Dependents 686c-674 <App>', () => {
  const getInitialState = ({
    isLoggedIn = true,
    isLoading = false,
    vaDependentsV2 = true,
    hasVaFileNumber = true,
  } = {}) => {
    return {
      initialState: {
        user: {
          login: {
            currentlyLoggedIn: isLoggedIn,
          },
          profile: {
            loading: isLoading,
            savedForms: [],
          },
        },
        featureToggles: {
          loading: isLoading,
          vaDependentsV2,
        },
        vaFileNumber: {
          hasVaFileNumber: {
            VALIDVAFILENUMBER: hasVaFileNumber,
          },
        },
      },
    };
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Stub the hooks used by the App component
    sandbox.stub(datadogExports, 'useBrowserMonitoring');
    sandbox.stub(featureToggleExports, 'useFeatureToggle').returns({
      useFormFeatureToggleSync: sinon.stub(),
      useToggleValue: sinon.stub().returns(true),
      TOGGLE_NAMES: { dependentsModuleEnabled: 'dependentsModuleEnabled' },
    });
    sandbox.stub(redirectExports, 'getShouldUseV2').returns(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render loading indicator when feature toggles are loading', () => {
    const screen = renderWithStoreAndRouter(
      <App location={{ pathname: '/introduction' }}>
        <p data-testid="test-content">Test content</p>
      </App>,
      getInitialState({ isLoading: true }),
    );

    const loadingIndicator = screen.container.querySelector(
      'va-loading-indicator',
    );
    expect(loadingIndicator).to.exist;
    expect(screen.queryByTestId('test-content')).to.be.null;
  });
});
