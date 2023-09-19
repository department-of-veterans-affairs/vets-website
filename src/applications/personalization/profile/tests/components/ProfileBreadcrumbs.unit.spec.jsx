import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { ProfileBreadcrumbs } from '../../components/ProfileBreadcrumbs';
import { PROFILE_PATHS } from '../../constants';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

const setup = path => {
  return renderInReduxProvider(
    <MemoryRouter initialEntries={[path]}>
      <ProfileBreadcrumbs />
    </MemoryRouter>,
    {
      initialState: {
        featureToggles: {
          loading: false,
          [Toggler.TOGGLE_NAMES.profileUseHubPage]: true,
        },
      },
    },
  );
};

describe('<ProfileBreadcrumbs />', () => {
  it('should render "Home" and "Profile" as base breadcrumbs', () => {
    const { getByText } = setup(PROFILE_PATHS.PROFILE_ROOT);

    expect(getByText('Home')).to.exist;
    expect(getByText('Profile')).to.exist;
  });

  describe('should render additional breadcrumb based on route', () => {
    it('renders personal information breadcrumb', () => {
      const { getByText } = setup(PROFILE_PATHS.PERSONAL_INFORMATION);

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Personal information')).to.exist;
    });

    it('renders contact information breadcrumb', () => {
      const { getByText } = setup(PROFILE_PATHS.CONTACT_INFORMATION);

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Contact information')).to.exist;
    });

    it('renders military information breadcrumb', () => {
      const { getByText } = setup(PROFILE_PATHS.MILITARY_INFORMATION);

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Military information')).to.exist;
    });

    it('renders direct deposit breadcrumb', () => {
      const { getByText } = setup(PROFILE_PATHS.DIRECT_DEPOSIT);

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Direct deposit information')).to.exist;
    });

    it('renders notification settings breadcrumb', () => {
      const { getByText } = setup(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Notification settings')).to.exist;
    });

    it('renders connected apps breadcrumb', () => {
      const { getByText } = setup(PROFILE_PATHS.CONNECTED_APPLICATIONS);

      expect(getByText('Home')).to.exist;
      expect(getByText('Profile')).to.exist;
      expect(getByText('Connected apps')).to.exist;
    });
  });
});
