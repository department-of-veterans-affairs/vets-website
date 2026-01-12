import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { ViewDependentsApp } from '../../containers/ViewDependentsApp';
import { splitPersons } from '../../util';
import mockDependentsList from '../e2e/fixtures/mock-dependents.json';

describe('<ViewDependentsApp />', () => {
  const buildApp = ({
    fetchDependentsSpy,
    fetchRatingInfoSpy,
    featureToggles = {},
    loggedIn = true,

    mockDependents = mockDependentsList.data.attributes.persons,

    dependentsVerificationFormToggle = true,
    updateDiariesStatus = false,
    hasMinimumRating = true,
    isLoggedIn = loggedIn,
  }) => {
    const user = {
      login: { currentlyLoggedIn: loggedIn },
      profile: { savedForms: [], prefillsAvailable: [], verified: false },
    };

    const dependents = splitPersons(mockDependents);

    const props = {
      user,
      loading: false,
      error: null,
      onAwardDependents: dependents.onAward,
      notOnAwardDependents: dependents.notOnAward,
      dependentsVerificationFormToggle,
      updateDiariesStatus,
      hasMinimumRating,
      isLoggedIn,
      fetchAllDependents: fetchDependentsSpy,
      fetchRatingInfo: fetchRatingInfoSpy,

      // No plan to use this built in 0538, so not adding tests
      manageDependentsToggle: false,
    };
    const store = {
      getState: () => ({
        featureToggles,
        user,
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: { get: () => null },
          dismissedDowntimeWarnings: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    return render(
      <Provider store={store}>
        <ViewDependentsApp {...props}>
          <div>App Children</div>
        </ViewDependentsApp>
      </Provider>,
    );
  };

  it('should render v1 app', () => {
    const fetchAllDependentsMock = sinon.spy();
    const fetchRatingInfoMock = sinon.spy();
    const { container } = buildApp({
      fetchDependentsSpy: fetchAllDependentsMock,
      fetchRatingInfoSpy: fetchRatingInfoMock,
      dependentsVerificationFormToggle: false,
    });

    expect($('h1', container)).to.exist;
    expect($('.medium-screen\\:vads-l-col--4', container)).to.exist; // side bar
    expect($('.medium-screen\\:vads-l-col--8', container)).to.exist; // main content
    expect($$('va-card', container).length).to.equal(0);
    expect($$('dl', container).length).to.equal(4); // 2 active, 2 not active
    // alert with link to 0538
    expect($('#update-warning-alert', container)).to.not.exist;
    // Link at bottom of page
    expect($$('va-link-action', container).length).to.equal(1);
  });

  it('should render v2 app', () => {
    const fetchAllDependentsMock = sinon.spy();
    const fetchRatingInfoMock = sinon.spy();
    const { container } = buildApp({
      fetchDependentsSpy: fetchAllDependentsMock,
      fetchRatingInfoSpy: fetchRatingInfoMock,
    });

    expect($('h1', container)).to.exist;
    expect($('.medium-screen\\:vads-l-col--4', container)).to.not.exist;
    expect($('.medium-screen\\:vads-l-col--8', container)).to.not.exist;
    expect($$('va-card', container).length).to.equal(4);
    expect($$('dl', container).length).to.equal(4); // 2 active, 2 not active
    // alert with link to 0538
    expect($('#update-warning-alert', container)).to.exist;
    // 2 links to 0538 & 1 link to 686c-674
    expect(
      $$(
        'va-link-action[text="Add or remove dependents on VA benefits"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$(
        'va-link-action[text="Start your disability benefits dependents verification"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$('va-link-action[text*="remove dependents"]', container).length,
    ).to.equal(1);
  });
});
