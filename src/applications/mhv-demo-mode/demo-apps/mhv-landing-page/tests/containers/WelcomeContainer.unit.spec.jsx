import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import WelcomeContainer from '../../containers/WelcomeContainer';
import reducers from '../../reducers';

const stateFn = ({ preferredName = 'Bob', first = 'Robert' } = {}) => ({
  user: {
    profile: {
      loa: {
        current: 3,
      },
      status: 'OK',
      userFullName: {
        first,
      },
      preferredName,
    },
  },
});

const setup = (initialState = stateFn(), props = {}) =>
  renderInReduxProvider(<WelcomeContainer {...props} />, {
    initialState,
    reducers,
  });

describe('WelcomeContainer component', () => {
  it('renders with preferred name', () => {
    const { getByRole } = setup();
    getByRole('heading', { name: /Welcome, Bob/ });
  });

  it("masks the user's name from datadog (no PII)", () => {
    const { getByText } = setup();
    const result = getByText('Bob').getAttribute('data-dd-privacy');
    expect(result).to.eq('mask');
  });

  it('renders when preferred name is not available', () => {
    const initialState = stateFn({ preferredName: null });
    const { getByRole } = setup(initialState);
    getByRole('heading', { name: 'Welcome, Robert' });
  });

  it('renders when name is not supplied', () => {
    const initialState = stateFn({ preferredName: null, first: null });
    const { getByRole } = setup(initialState);
    getByRole('heading', { name: 'Welcome' });
  });

  describe('Profile links', () => {
    it('calls datadogRum.addAction on click of profile links', async () => {
      const { getByRole } = setup();
      const spyDog = sinon.spy(datadogRum, 'addAction');
      const profileLink = getByRole('link', { name: /profile/i });
      // Change the link to an anchor, so JSDOM does not complain about navigation
      profileLink.href = '#dummy-link';
      fireEvent.click(profileLink);

      await waitFor(() => {
        expect(spyDog.called).to.be.true;
      });

      spyDog.restore();
    });

    it('reports to GA on click of profile links', async () => {
      const eventData = {
        event: 'nav-link-click',
        action: 'click',
        'link-destination': '/profile',
        'link-label': 'Profile',
        'link-origin': 'http://localhost/',
      };
      global.window.location = new URL(`http://localhost/`);
      global.window.dataLayer = [];
      const { getByRole } = setup();
      const profileLink = getByRole('link', { name: /profile/i });
      // Change the link to an anchor, so JSDOM does not complain about navigation
      profileLink.href = '#dummy-link';
      fireEvent.click(profileLink);
      await waitFor(() => {
        const event = global.window.dataLayer.slice(-1)[0];
        expect(event).to.deep.equal(eventData);
      });
    });
  });
});
