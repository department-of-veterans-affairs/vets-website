import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import App from '../../containers/App';

describe('Medications <App>', () => {
  const initialStateFeatureFlag = (loading = true, flag = true) => {
    return {
      initialState: {
        featureToggles: {
          loading,
          // eslint-disable-next-line camelcase
          mhv_medications_to_va_gov_release: flag,
        },
      },
      path: `/`,
      reducers: reducer,
    };
  };
  it('feature flags are still loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(),
    );
    expect(screenFeatureToggle.getByTestId('rx-feature-flag-loading-indicator'))
      .to.exist;
    expect(screenFeatureToggle.queryByText('unit test paragraph')).to.be.null;
  });

  it('feature flag set to false', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(false, false),
    );
    expect(screenFeatureToggle.queryByText('unit test paragraph')).to.be.null;
  });

  it('feature flag set to true', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(false, true),
    );
    expect(screenFeatureToggle.queryByText('unit test paragraph')).to.exist;
  });
});
