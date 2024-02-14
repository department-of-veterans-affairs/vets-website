import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../mocks/setup';
import Breadcrumbs from '../../components/Breadcrumbs';

describe('VAOS <Breadcrumbs>', () => {
  it('should display Pending appointments as last crumb', () => {
    // Given the path is on pending
    const url = 'my-health/appointments/pending';
    const initialState = {};

    // when web component  is rendered
    const screen = renderWithStoreAndRouter(
      <Breadcrumbs breadcrumbList={Breadcrumbs} />,
      {
        initialState,
        path: url,
      },
    );
    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    // it will display the last crumb
    expect(crumb).to.equal('Pending appointments');
  });

  it('should display text in the breadcrumb when path is type-of-care', () => {
    // Given the path is on type of care
    const url = '/schedule/type-of-care';
    const initialState = {};
    // when web component is rendered
    const screen = renderWithStoreAndRouter(
      <Breadcrumbs breadcrumbList={Breadcrumbs} />,
      {
        initialState,
        path: url,
      },
    );
    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    // it will display the last crumb
    expect(crumb[0]).to.equal('Choose the type of care you need');
  });

  it('should display Review in the breadcrumb when path is review page', () => {
    // Given the path is on review
    const url = '/schedule/review';
    const initialState = {};
    // when web component is rendered
    const screen = renderWithStoreAndRouter(
      <Breadcrumbs breadcrumbList={Breadcrumbs} />,
      {
        initialState,
        path: url,
      },
    );
    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    // it will display the last crumb
    expect(crumb[0]).to.equal('Review your appointment details');
  });

  it('should display covid in the breadcrumb when path is covid-vaccine', () => {
    const url = '/schedule/covid-vaccine/';
    const initialState = {};

    const screen = renderWithStoreAndRouter(
      <Breadcrumbs breadcrumbList={Breadcrumbs} />,
      {
        initialState,
        path: url,
      },
    );

    const navigation = screen.getByRole('navigation', { name: 'Breadcrumbs' });
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb[0]).to.equal('COVID-19 vaccine appointment');
  });
});
