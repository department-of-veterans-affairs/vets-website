import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const mockStore = ({ isFeatureEnabled = false } = {}) => ({
  getState: () => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_secondary_navigation_enabled: isFeatureEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const testSecNavItems = [
  {
    title: 'My HealtheVet',
    iconClass: 'fas fa-home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    abbreviation: 'Appts',
    iconClass: 'fas fa-calendar',
    href: `/my-health/appointments`,
  },
  {
    title: 'Messages',
    iconClass: 'fas fa-comments',
    href: `/my-health/secure-messages`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    iconClass: 'fas fa-prescription-bottle',
    href: `/my-health/medications`,
  },
  {
    title: 'Records',
    iconClass: 'fas fa-file-medical',
    href: `/my-health/medical-records`,
  },
];

describe('MHV Secondary Navigation Menu Component', () => {
  it('renders when the toggle is on', () => {
    const mock = mockStore({ isFeatureEnabled: true });
    const { getAllByRole } = render(
      <Provider store={mock}>
        <MhvSecondaryNavMenu items={testSecNavItems} />
      </Provider>,
    );
    expect(testSecNavItems).to.not.be.empty;
    const links = getAllByRole('link');
    expect(links.length).to.eql(testSecNavItems.length);
    testSecNavItems.forEach((navItem, i) => {
      expect(links[i].pathname).to.be.eql(navItem.href);
    });
  });

  it('does not render when the toggle is off', () => {
    const mock = mockStore();
    const { getAllByRole } = render(
      <Provider store={mock}>
        <MhvSecondaryNavMenu items={testSecNavItems} />
      </Provider>,
    );
    expect(testSecNavItems).to.not.be.empty;
    expect(() => getAllByRole('link')).to.throw();
  });

  it('sets the proper item to active based on URL pathname', () => {
    const activeClassString = 'active';
    const mock = mockStore({ isFeatureEnabled: true });
    expect(testSecNavItems).to.not.be.empty;
    testSecNavItems.forEach((item, itemIndex) => {
      delete window.location;
      window.location = new URL(`https://www.va.gov${item.href}`);
      const { getAllByTestId } = render(
        <Provider store={mock}>
          <MhvSecondaryNavMenu items={testSecNavItems} />
        </Provider>,
      );
      const links = getAllByTestId('mhv-sec-nav-item');
      links.forEach((link, linkIndex) => {
        // This tests that the selected item is active and all others are not.
        if (itemIndex === linkIndex)
          expect(link.className).to.include(activeClassString);
        else expect(link.className).to.not.include(activeClassString);
      });
      cleanup(); // must be done after the render
    });
  });
});
