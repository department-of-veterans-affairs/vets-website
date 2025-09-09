import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';

import ReferralBreadcrumbs from './ReferralBreadcrumbs';

import * as flow from '../flow';

const initialState = {
  referral: {
    currentPage: 'appointments',
  },
};

describe('VAOS Component: ReferralBreadcrumbs', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should render Breadcrumbs component when breadcrumb does not start with "Back"', () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });
    screen.history.push('/');
    const navigation = screen.getByTestId('vaos-breadcrumbs');
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Appointments');
  });

  it('Should have Referrals and requests in breadcrumb', () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    screen.history.push(
      '/schedule-referral?id=1234&referrer=referrals-requests',
    );
    const navigation = screen.getByTestId('vaos-breadcrumbs');
    expect(navigation).to.exist;
    const hasReferralBreadcrumbs = navigation.breadcrumbList.some(
      breadcrumb => breadcrumb.label === 'Referrals and requests',
    );

    expect(hasReferralBreadcrumbs).to.equal(true);
  });

  it('should render back link correctly when breadcrumb starts with "Back"', () => {
    const store = createTestStore(initialState);
    initialState.referral.currentPage = 'complete';
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    const navigation = screen.getByRole('navigation', { name: 'backlink' });
    expect(navigation).to.exist;
    const backLink = screen.getByTestId('back-link');
    expect(backLink).to.exist;
    expect(backLink).to.have.attribute('href', '/my-health/appointments');
    expect(backLink).to.have.attribute('text', 'Back to appointments');
  });

  it('should call routeToPreviousReferralPage when back link is clicked', () => {
    const routeToPreviousReferralPage = sandbox.spy(
      flow,
      'routeToPreviousReferralPage',
    );
    initialState.referral.currentPage = 'complete';
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    const backLink = screen.getByTestId('back-link');
    backLink.click();
    expect(routeToPreviousReferralPage.called).to.be.true;
  });
});
