import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { ProfileBreadcrumbs } from '../../components/ProfileBreadcrumbs';
import { PROFILE_PATHS } from '../../constants';

describe('<ProfileBreadcrumbs />', () => {
  it('should render "Home" and "Profile" as base breadcrumbs', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={[PROFILE_PATHS.PROFILE_ROOT]}>
        <ProfileBreadcrumbs />
      </MemoryRouter>,
    );

    expect(getByText('Home')).to.exist;
    expect(getByText('Profile')).to.exist;
  });

  describe('should render additional breadcrumb based on route', () => {
    it('renders personal information breadcrumb', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[PROFILE_PATHS.PERSONAL_INFORMATION]}>
          <ProfileBreadcrumbs />
        </MemoryRouter>,
      );

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Personal information')).to.exist;
    });

    it('renders contact information breadcrumb', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[PROFILE_PATHS.CONTACT_INFORMATION]}>
          <ProfileBreadcrumbs />
        </MemoryRouter>,
      );

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Contact information')).to.exist;
    });

    it('renders military information breadcrumb', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[PROFILE_PATHS.MILITARY_INFORMATION]}>
          <ProfileBreadcrumbs />
        </MemoryRouter>,
      );

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Military information')).to.exist;
    });

    it('renders direct deposit breadcrumb', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[PROFILE_PATHS.DIRECT_DEPOSIT]}>
          <ProfileBreadcrumbs />
        </MemoryRouter>,
      );

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Direct deposit information')).to.exist;
    });

    it('renders notification settings breadcrumb', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[PROFILE_PATHS.NOTIFICATION_SETTINGS]}>
          <ProfileBreadcrumbs />
        </MemoryRouter>,
      );

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Notification settings')).to.exist;
    });

    it('renders connected apps breadcrumb', () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[PROFILE_PATHS.CONNECTED_APPLICATIONS]}>
          <ProfileBreadcrumbs />
        </MemoryRouter>,
      );

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Connected apps')).to.exist;
    });
  });
});
