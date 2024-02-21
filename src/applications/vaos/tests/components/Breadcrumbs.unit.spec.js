import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../mocks/setup';
import Breadcrumbs from '../../components/Breadcrumbs';

describe('VAOS Component: Breadcrumbs', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingBreadcrumbUrlUpdate: true,
    },
  };
  it('should display Pending appointments as last crumb', () => {
    const url = 'my-health/appointments/pending';
    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState,
      path: url,
    });
    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Pending appointments');
  });

  it('should display Past appointments as last crumb', () => {
    const url = 'my-health/appointments/past';
    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState,
      path: url,
    });
    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Past appointments');
  });
});
