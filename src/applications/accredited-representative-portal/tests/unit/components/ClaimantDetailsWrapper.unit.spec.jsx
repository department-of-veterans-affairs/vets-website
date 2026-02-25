import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from '~/platform/site-wide/feature-toggles/actionTypes';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import { createReduxStore } from '../../../utilities/store';
import ClaimantDetailsWrapper from '../../../components/ClaimantDetailsWrapper';

const renderWrapper = ({
  featureEnabled = true,
  claimantId = '123',
  route = 'submission-history',
} = {}) => {
  const store = createReduxStore();
  connectFeatureToggle(store.dispatch);
  store.dispatch({
    type: FETCH_TOGGLE_VALUES_SUCCEEDED,
    payload: {
      // eslint-disable-next-line camelcase
      accredited_representative_portal_claimant_details: featureEnabled,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          `/representative/find-claimant/${route}/${claimantId}`,
        ]}
      >
        <Routes>
          <Route
            path="/representative/find-claimant/:activeTab/:claimantId"
            element={
              <ClaimantDetailsWrapper firstName="John" lastName="Doe">
                <div data-testid="child-content">Test child content</div>
              </ClaimantDetailsWrapper>
            }
          />
          <Route
            path="/find-claimant"
            element={<div data-testid="redirect-target">Find Claimant</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('ClaimantDetailsWrapper', () => {
  it('can import ClaimantDetailsWrapper module', () => {
    const ClaimantDetailsWrapperModule = require('../../../components/ClaimantDetailsWrapper');
    expect(ClaimantDetailsWrapperModule).to.exist;
    expect(ClaimantDetailsWrapperModule.default).to.be.a('function');
  });

  it('renders the claimant name', () => {
    const { getByText } = renderWrapper();
    expect(getByText('Doe, John')).to.exist;
  });

  it('renders the Claimant label', () => {
    const { getByText } = renderWrapper();
    expect(getByText('Claimant')).to.exist;
  });

  it('renders child content', () => {
    const { getByTestId } = renderWrapper();
    expect(getByTestId('child-content')).to.exist;
  });

  it('renders the side navigation', () => {
    const { container } = renderWrapper();
    const sidenav = container.querySelector('va-sidenav');
    expect(sidenav).to.exist;
    expect(sidenav.getAttribute('header')).to.equal('Claimant');
  });

  it('renders sidenav items with correct labels', () => {
    const { container } = renderWrapper();
    const sidenavItems = container.querySelectorAll('va-sidenav-item');
    expect(sidenavItems.length).to.equal(2);
    expect(sidenavItems[0].getAttribute('label')).to.equal('Claimant overview');
    expect(sidenavItems[1].getAttribute('label')).to.equal(
      'Submission history',
    );
  });

  it('renders sidenav items with correct hrefs', () => {
    const { container } = renderWrapper();
    const sidenavItems = container.querySelectorAll('va-sidenav-item');
    expect(sidenavItems[0].getAttribute('href')).to.equal(
      '/representative/find-claimant/claimant-overview/123',
    );
    expect(sidenavItems[1].getAttribute('href')).to.equal(
      '/representative/find-claimant/submission-history/123',
    );
  });

  it('redirects to find-claimant when feature flag is disabled', () => {
    const { queryByText, getByTestId } = renderWrapper({
      featureEnabled: false,
    });
    expect(queryByText('Doe, John')).to.not.exist;
    expect(getByTestId('redirect-target')).to.exist;
  });
});
