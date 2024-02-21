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

  it('should display text in the breadcrumb when path is type-of-care', () => {
    const url = '/schedule/type-of-care';
    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState,
      path: url,
    });
    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Choose the type of care you need');
  });

  it('should display Review in the breadcrumb when path is review page', () => {
    const url = '/schedule/review';
    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState,
      path: url,
    });
    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Review your appointment details');
  });

  it('should display covid in the breadcrumb when path is covid-vaccine', () => {
    const url = '/schedule/covid-vaccine/';
    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState,
      path: url,
    });

    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('COVID-19 vaccine appointment');
  });

  it('should inquire covid vaccine received as last crumb when path is dose received', () => {
    const url = '/schedule/covid-vaccine/doses-received';
    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState,
      path: url,
    });
    const navigation = screen.getByRole('navigation', {
      name: 'Breadcrumbs',
    });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Have you received a COVID-19 vaccine?');
  });
});
