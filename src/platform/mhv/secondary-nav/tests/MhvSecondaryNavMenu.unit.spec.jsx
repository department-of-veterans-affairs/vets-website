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
    icon: 'fas fa-home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    abbreviation: 'Appts',
    icon: 'fas fa-calendar',
    href: '/my-health/appointments',
  },
  {
    title: 'Messages',
    icon: 'fas fa-comments',
    href: '/my-health/secure-messages',
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    icon: 'fas fa-prescription-bottle',
    href: '/my-health/medications/about',
    appRootUrl: '/my-health/medications',
  },
  {
    title: 'Records',
    icon: 'fas fa-file-medical',
    href: '/my-health/medical-records',
  },
];

/**
 * Set the current window's URL.
 * @param {String} pathname the pathname of the URL
 */
const setWindowUrl = pathname => {
  delete window.location;
  window.location = new URL(`https://www.va.gov${pathname}`);
};

describe('MHV Secondary Navigation Menu Component', () => {
  describe('feature toggle', () => {
    it('renders when the toggle is on', () => {
      const mock = mockStore({ isFeatureEnabled: true });
      const { getAllByRole } = render(
        <Provider store={mock}>
          <MhvSecondaryNavMenu items={testSecNavItems} />
        </Provider>,
      );
      const links = getAllByRole('link');
      expect(links.length).to.eql(testSecNavItems.length);
      testSecNavItems.forEach((navItem, i) => {
        expect(links[i].pathname).to.be.eql(navItem.href);
      });
    });

    it('does not render when the toggle is off', () => {
      const mock = mockStore();
      const { container } = render(
        <Provider store={mock}>
          <MhvSecondaryNavMenu items={testSecNavItems} />
        </Provider>,
      );
      expect(container).to.be.empty;
    });
  });

  describe('set active item', () => {
    const activeClassString = 'active';
    const mock = mockStore({ isFeatureEnabled: true });
    const medNavItem = {
      title: 'Medications',
      abbreviation: 'Meds',
      icon: 'fas fa-prescription-bottle',
      href: '/my-health/records',
      appRootUrl: '/my-health/medications',
    };

    /**
     * Gets the one sec nav item by rendering it with a given item.
     * @param {Object} item the item to render
     * @returns the link to the item
     */
    const getOneLink = item => {
      const { getByTestId } = render(
        <Provider store={mock}>
          <MhvSecondaryNavMenu items={[item]} />
        </Provider>,
      );
      return getByTestId('mhv-sec-nav-item');
    };

    it('based on href', () => {
      testSecNavItems.forEach((item, itemIndex) => {
        setWindowUrl(item.href);
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

    it('matches href with trailing slash in href', () => {
      medNavItem.href = '/my-health/medications/';
      setWindowUrl('/my-health/medications');
      expect(getOneLink(medNavItem).className).to.include(activeClassString);
    });

    it('matches href with trailing slash in URL', () => {
      setWindowUrl('/my-health/medications/');
      expect(getOneLink(medNavItem).className).to.include(activeClassString);
    });

    it('matches app root URL', () => {
      setWindowUrl('/my-health/medications/some-page');
      expect(getOneLink(medNavItem).className).to.include(activeClassString);
    });

    it('does not match app root URL', () => {
      setWindowUrl('/my-health/appointments/some-page');
      expect(getOneLink(medNavItem).className).to.not.include(
        activeClassString,
      );
    });

    it('matches app root URL with trailing slash in URL', () => {
      setWindowUrl('/my-health/medications/');
      expect(getOneLink(medNavItem).className).to.include(activeClassString);
    });

    it('matches app root URL with trailing slash in app root URL', () => {
      medNavItem.appRootUrl = '/my-health/medications/';
      setWindowUrl('/my-health/medications');
      expect(getOneLink(medNavItem).className).to.include(activeClassString);
    });
  });
});
