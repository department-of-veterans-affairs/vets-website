import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import manifest from '../manifest.json';
import Breadcrumbs, { relativeRouteProcessor } from './Breadcrumbs';

describe('VAOS Component: Breadcrumbs', () => {
  const initialState = {};
  it('should display Pending appointments as last crumb', () => {
    const url = 'my-health/appointments/pending';
    const screen = renderWithStoreAndRouter(<Breadcrumbs />, {
      initialState,
      path: url,
    });
    const navigation = screen.getByTestId('vaos-breadcrumbs');
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
    const navigation = screen.getByTestId('vaos-breadcrumbs');
    expect(navigation).to.exist;
    const crumb =
      navigation.breadcrumbList[navigation.breadcrumbList.length - 1].label;
    expect(crumb).to.equal('Past appointments');
  });

  it('should change the href to a relative route', () => {
    const currentUrl = `${manifest.rootUrl}/pending`;
    const relativeUrl = relativeRouteProcessor(currentUrl);
    expect(relativeUrl).to.equal('/pending');
  });

  it('should always make sure the relative route starts with a slash', () => {
    const currentUrl = 'pending';
    const relativeUrl = relativeRouteProcessor(currentUrl);
    expect(relativeUrl).to.equal('/pending');
  });

  it('should replace up to the rootUrl', () => {
    const currentUrl = 'https://www.va.gov/my-health/appointments/past';
    const relativeUrl = relativeRouteProcessor(currentUrl);
    expect(relativeUrl).to.equal('/past');
  });

  it('should not change the href if it is not based off the manifest.rootUrl', () => {
    const currentUrl = 'https://www.va.gov/my-health/xyz/pending';
    const relativeUrl = relativeRouteProcessor(currentUrl);
    expect(relativeUrl).to.equal(currentUrl);
  });

  it('should not change the href if it is a URL with a scheme that is not the same as the manifest.rootUrl', () => {
    const currentUrl = 'https://www.va.gov/my-health/xyz/appointments/pending';
    const relativeUrl = relativeRouteProcessor(currentUrl);
    expect(relativeUrl).to.equal(currentUrl);
  });

  it('should not change the href if it is not based off the manifest.rootUrl', () => {
    const currentUrl = 'abc/def/ghi';
    const relativeUrl = relativeRouteProcessor(currentUrl);
    expect(relativeUrl).to.equal(`/${currentUrl}`);
  });
});
