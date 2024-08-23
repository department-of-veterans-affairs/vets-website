import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import LinkList from '../LinkList';
import { APP_NAMES } from '../../utils/appConstants';
import { URLS } from '../../utils/navigation';

describe('LinkList', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  const appointmentsOn = {
    // eslint-disable-next-line camelcase
    check_in_experience_upcoming_appointments_enabled: true,
  };
  it('renders correct for Pre-check-in confirmation', () => {
    const screen = render(
      <CheckInProvider
        store={{
          app: APP_NAMES.PRE_CHECK_IN,
          features: appointmentsOn,
        }}
        router={{ currentPage: URLS.COMPLETE }}
      >
        <LinkList />
      </CheckInProvider>,
    );
    expect(screen.getByTestId('go-to-appointments-link-pre-check-in')).to.exist;
    expect(screen.getByTestId('external-link')).to.exist;
    expect(screen.queryAllByTestId('link-wrapper')).to.have.length(2);
  });
  it('renders correct for Pre-check-in upcoming appointments page', () => {
    const screen = render(
      <CheckInProvider
        store={{
          app: APP_NAMES.PRE_CHECK_IN,
          features: appointmentsOn,
        }}
        router={{ currentPage: URLS.UPCOMING_APPOINTMENTS }}
      >
        <LinkList />
      </CheckInProvider>,
    );
    expect(screen.getByTestId('go-to-appointments-link-pre-check-in')).to.exist;
    expect(screen.queryByTestId('external-link')).to.not.exist;
    expect(screen.queryAllByTestId('link-wrapper')).to.have.length(1);
  });
  it('renders correct for Day-of confirmation', () => {
    const screen = render(
      <CheckInProvider
        store={{
          app: APP_NAMES.CHECK_IN,
          features: appointmentsOn,
        }}
        router={{ currentPage: URLS.COMPLETE }}
      >
        <LinkList />
      </CheckInProvider>,
    );
    expect(screen.getByTestId('go-to-upcoming-appointments-link')).to.exist;
    expect(screen.getByTestId('go-to-appointments-link')).to.exist;
    expect(screen.getByTestId('external-link')).to.exist;
    expect(screen.queryAllByTestId('link-wrapper')).to.have.length(3);
  });
  it('renders correct for Day-of upcoming appointments page', () => {
    const screen = render(
      <CheckInProvider
        store={{
          app: APP_NAMES.CHECK_IN,
          features: appointmentsOn,
        }}
        router={{ currentPage: URLS.UPCOMING_APPOINTMENTS }}
      >
        <LinkList />
      </CheckInProvider>,
    );
    expect(screen.getByTestId('go-to-appointments-link')).to.exist;
    expect(screen.queryByTestId('external-link')).to.not.exist;
    expect(screen.queryAllByTestId('link-wrapper')).to.have.length(1);
  });
  it('renders correct for pre-check-in appointments page', () => {
    const screen = render(
      <CheckInProvider
        store={{
          app: APP_NAMES.PRE_CHECK_IN,
          features: appointmentsOn,
        }}
        router={{ currentPage: URLS.APPOINTMENTS }}
      >
        <LinkList />
      </CheckInProvider>,
    );
    expect(screen.getByTestId('go-to-upcoming-appointments-link')).to.exist;
    expect(screen.queryAllByTestId('link-wrapper')).to.have.length(1);
  });
  it('renders correct for day-of appointments page', () => {
    const screen = render(
      <CheckInProvider
        store={{
          app: APP_NAMES.CHECK_IN,
          features: appointmentsOn,
        }}
        router={{ currentPage: URLS.APPOINTMENTS }}
      >
        <LinkList />
      </CheckInProvider>,
    );
    expect(screen.getByTestId('go-to-upcoming-appointments-link')).to.exist;
    expect(screen.queryAllByTestId('link-wrapper')).to.have.length(1);
  });
});
