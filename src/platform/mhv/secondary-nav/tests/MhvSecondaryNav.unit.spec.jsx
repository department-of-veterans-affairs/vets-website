import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import MhvSecondaryNav from '../containers/MhvSecondaryNav';

const mockStore = ({
  mhvSecondaryNavigationEnabled = false,
  mhvTransitionalMedicalRecordsLandingPage = false,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      mhv_secondary_navigation_enabled: mhvSecondaryNavigationEnabled,
      mhvSecondaryNavigationEnabled,
      // eslint-disable-next-line camelcase
      mhv_transitional_medical_records_landing_page: mhvTransitionalMedicalRecordsLandingPage,
      mhvTransitionalMedicalRecordsLandingPage,
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
    const mock = mockStore({ mhvSecondaryNavigationEnabled: true });
    const { getAllByRole } = render(
      <Provider store={mock}>
        <MhvSecondaryNav items={testSecNavItems} />
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
        <MhvSecondaryNav items={testSecNavItems} />
      </Provider>,
    );
    // expect(() => getAllByRole('link')).to.throw();
    expect(container).to.be.empty;
  });

  it('sets the proper item to active based on URL pathname', () => {
    const activeClassString = 'active';
    const mock = mockStore({ mhvSecondaryNavigationEnabled: true });
    testSecNavItems.forEach((item, itemIndex) => {
      delete window.location;
      window.location = new URL(`https://www.va.gov${item.href}`);
      const { getAllByTestId } = render(
        <Provider store={mock}>
          <MhvSecondaryNav items={testSecNavItems} />
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

  describe('transitional Medical Records page -- enabled', () => {
    it('renders the /my-health/records link', async () => {
      const store = mockStore({
        mhvSecondaryNavigationEnabled: true,
        mhvTransitionalMedicalRecordsLandingPage: true,
      });
      const { findByRole } = render(
        <Provider store={store}>
          <MhvSecondaryNav items={testSecNavItems} />
        </Provider>,
      );
      const result = await findByRole('link', { name: /Records$/ });
      expect(result.getAttribute('href')).to.eq('/my-health/records');
    });
  });

  describe('transitional Medical Records page -- disabled', () => {
    it('renders the /my-health/medical-records link', async () => {
      const store = mockStore({
        mhvSecondaryNavigationEnabled: true,
        mhvTransitionalMedicalRecordsLandingPage: false,
      });
      const { findByRole } = render(
        <Provider store={store}>
          <MhvSecondaryNav items={testSecNavItems} />
        </Provider>,
      );
      const result = await findByRole('link', { name: /Records$/ });
      expect(result.getAttribute('href')).to.eq('/my-health/medical-records');
    });
  });
});
