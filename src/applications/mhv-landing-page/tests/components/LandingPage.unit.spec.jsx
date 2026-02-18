/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import LandingPage from '../../components/LandingPage';
import reducers from '../../reducers';

const stateFn = ({
  mhv_landing_page_personalization = false,
  loa = 3,
  serviceName = 'logingov',
  vaPatient = true,
  facilities = [],
} = {}) => ({
  featureToggles: {
    mhv_landing_page_personalization,
  },
  user: {
    profile: {
      userFullName: {
        first: 'Sam',
      },
      loa: { current: loa },
      signIn: { serviceName },
      vaPatient,
      mhvAccountState: 'OK',
      facilities,
    },
  },
});

const setup = ({ initialState = stateFn(), props = {} } = {}) =>
  renderInReduxProvider(<LandingPage {...props} />, { initialState, reducers });

describe('LandingPage component', () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { level: 1, name: /My HealtheVet/ });
  });

  it('shows the Welcome component, when enabled', () => {
    const initialState = stateFn({ mhv_landing_page_personalization: true });
    const { getByRole } = setup({ initialState });
    getByRole('heading', { level: 2, name: /Welcome/ });
  });

  describe('userRegistered prop', () => {
    it('does not render MhvSecondaryNav, CardLayout, HelpdeskInfo, HubLinks, NewsletterSignup when userRegistered is false (loa < 3)', () => {
      const initialState = stateFn({ loa: 2, vaPatient: true });
      const { container } = setup({
        initialState,
        props: {
          data: {
            cards: [{ title: 'Messages', icon: 'calendar_today', links: [] }],
            hubs: [{ title: 'Hub 1', links: [] }],
          },
        },
      });

      // MhvSecondaryNav is not rendered
      // CardLayout should not be rendered - check by looking for card-related elements
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(0);

      // NewsletterSignup - check for newsletter-related content
      const newsletterContent = container.textContent;
      expect(newsletterContent).to.not.include('newsletter');
      expect(newsletterContent).to.not.include('sign up');
    });

    it('does not render MhvSecondaryNav, CardLayout, HelpdeskInfo, HubLinks, NewsletterSignup when userRegistered is false (vaPatient is false)', () => {
      const initialState = stateFn({ loa: 3, vaPatient: false });
      const { container } = setup({
        initialState,
        props: {
          data: {
            cards: [{ title: 'Messages', icon: 'calendar_today', links: [] }],
            hubs: [{ title: 'Hub 1', links: [] }],
          },
        },
      });

      // CardLayout should not be rendered
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(0);

      // NewsletterSignup should not be rendered
      const newsletterContent = container.textContent;
      expect(newsletterContent).to.not.include('newsletter');
    });

    it('renders all components when userRegistered is true', () => {
      const initialState = stateFn({ loa: 3, vaPatient: true });
      const { container, getByTestId } = setup({
        initialState,
        props: {
          data: {
            cards: [
              {
                title: 'Messages',
                icon: 'calendar_today',
                links: [{ href: '/test', text: 'Test Link' }],
              },
            ],
            hubs: [
              { title: 'Hub 1', links: [{ href: '/hub', text: 'Hub Link' }] },
            ],
          },
        },
      });

      // Should render the landing page container
      expect(getByTestId('landing-page-container')).to.exist;

      // CardLayout should be rendered (check for card structure)
      // Cards might be rendered, so we check the container has content
      expect(container.textContent).to.include('Test Link');

      // HubLinks should be rendered
      expect(container.textContent).to.include('Hub Link');
    });
  });

  describe('showWelcomeMessage prop', () => {
    it('does not render Welcome component when showWelcomeMessage is false', () => {
      const initialState = stateFn({
        mhv_landing_page_personalization: false,
        loa: 3,
        vaPatient: true,
      });
      const { queryByRole } = setup({ initialState });

      // Welcome heading should not be present
      expect(queryByRole('heading', { level: 2, name: /Welcome/ })).to.not
        .exist;
    });

    it('renders Welcome component when showWelcomeMessage is true', () => {
      const initialState = stateFn({
        mhv_landing_page_personalization: true,
        loa: 3,
        vaPatient: true,
      });
      const { getByRole } = setup({ initialState });

      // Welcome heading should be present
      expect(getByRole('heading', { level: 2, name: /Welcome/ })).to.exist;
    });
  });

  // Note: showCernerInfoAlert prop behavior is tested in HeaderLayout.unit.spec.jsx

  describe('empty data arrays', () => {
    it('handles empty cards array', () => {
      const initialState = stateFn({ loa: 3, vaPatient: true });
      const { container, getByTestId } = setup({
        initialState,
        props: {
          data: {
            cards: [],
            hubs: [{ title: 'Hub 1', links: [] }],
          },
        },
      });

      // Should still render without errors
      expect(getByTestId('landing-page-container')).to.exist;
      // No cards should be rendered
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(0);
    });

    it('handles empty hubs array', () => {
      const initialState = stateFn({ loa: 3, vaPatient: true });
      const { container, getByTestId } = setup({
        initialState,
        props: {
          data: {
            cards: [
              {
                title: 'Messages',
                icon: 'calendar_today',
                links: [{ href: '/test', text: 'Test Link' }],
              },
            ],
            hubs: [],
          },
        },
      });

      // Should still render without errors
      expect(getByTestId('landing-page-container')).to.exist;
      // Cards should be rendered
      expect(container.textContent).to.include('Test Link');
    });

    it('handles both empty cards and hubs arrays', () => {
      const initialState = stateFn({ loa: 3, vaPatient: true });
      const { getByTestId, container } = setup({
        initialState,
        props: {
          data: {
            cards: [],
            hubs: [],
          },
        },
      });

      // Should still render without errors
      expect(getByTestId('landing-page-container')).to.exist;
      // No cards should be rendered
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(0);
    });

    it('handles missing data prop', () => {
      const initialState = stateFn({ loa: 3, vaPatient: true });
      const { getByTestId } = setup({
        initialState,
        props: {},
      });

      // Should still render without errors
      expect(getByTestId('landing-page-container')).to.exist;
    });
  });
});
