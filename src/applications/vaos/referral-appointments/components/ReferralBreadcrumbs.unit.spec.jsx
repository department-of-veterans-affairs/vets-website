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

  it.skip('should render Breadcrumbs component when breadcrumb does not start with "Back"', () => {
    sandbox.stub(flow, 'getReferralUrlLabel').returns('Label');
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Label');
  });

  it('Should have Referrals and requests in breadcrumb', () => {
    sandbox.stub(flow, 'getReferralUrlLabel').returns('Label');
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    screen.history.push(
      '/schedule-referral?id=1234&referrer=referrals-requests',
    );

    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });

    expect(navigation).to.exist;
    const hasReferralBreadcrumbs = navigation.breadcrumbList.some(
      breadcrumb => breadcrumb.label === 'Referrals and requests',
    );

    expect(hasReferralBreadcrumbs).to.equal(true);
  });

  it('should render back link correctly when breadcrumb starts with "Back"', () => {
    sandbox.stub(flow, 'getReferralUrlLabel').returns('Back to previous page');

    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    const navigation = screen.getByRole('navigation', { name: 'backlink' });
    expect(navigation).to.exist;
    const backLink = screen.getByTestId('back-link');
    expect(backLink).to.exist;
    expect(backLink).to.have.attribute('href', '#');
    expect(backLink).to.have.attribute('text', 'Back to previous page');
  });

  it('should call routeToPreviousReferralPage when back link is clicked', () => {
    const routeToPreviousReferralPage = sandbox.stub(
      flow,
      'routeToPreviousReferralPage',
    );
    sandbox.stub(flow, 'getReferralUrlLabel').returns('Back to previous page');

    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    const backLink = screen.getByTestId('back-link');
    backLink.click();
    expect(routeToPreviousReferralPage.called).to.be.true;
  });
});
