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

  it('should render breadcrumbs correctly', () => {
    sandbox.stub(flow, 'getReferralBreadcumb').returns({
      useBackBreadcrumb: false,
      label: 'Label',
      href: '/test',
    });
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

  it('should render back link correctly', () => {
    sandbox.stub(flow, 'getReferralBreadcumb').returns({
      useBackBreadcrumb: true,
      label: 'Custom Label',
      href: '/test',
    });
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReferralBreadcrumbs />, {
      store,
    });

    const navigation = screen.getByRole('navigation', { name: 'backlink' });
    expect(navigation).to.exist;
    const backLink = screen.getByTestId('back-link');
    expect(backLink).to.exist;
    expect(backLink).to.have.attribute('href', '/test');
    expect(backLink).to.have.attribute('text', 'Custom Label');
  });
});
