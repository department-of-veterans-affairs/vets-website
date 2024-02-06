import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { ProfileBreadcrumbs } from '../../components/ProfileBreadcrumbs';
import { PROFILE_PATHS } from '../../constants';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';

const setup = path => {
  const view = renderInReduxProvider(
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

  const breadcrumbList = JSON.parse(
    view.container
      .querySelector('va-breadcrumbs')
      .getAttribute('breadcrumb-list'),
  );

  return { breadcrumbList };
};

describe('<ProfileBreadcrumbs />', () => {
  it('should render "Home" and "Profile" as base breadcrumbs', () => {
    const { breadcrumbList } = setup(PROFILE_PATHS.PROFILE_ROOT);

    expect(breadcrumbList[0].label).to.equal('Home');
    expect(breadcrumbList[1].label).to.equal('Profile');
  });

  describe('should render additional breadcrumb based on route', () => {
    it('renders personal information breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.PERSONAL_INFORMATION);

      expect(breadcrumbList[0].label).to.equal('Home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Personal information');
    });

    it('renders contact information breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.CONTACT_INFORMATION);

      expect(breadcrumbList[0].label).to.equal('Home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Contact information');
    });

    it('renders military information breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.MILITARY_INFORMATION);

      expect(breadcrumbList[0].label).to.equal('Home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Military information');
    });

    it('renders direct deposit breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.DIRECT_DEPOSIT);

      expect(breadcrumbList[0].label).to.equal('Home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Direct deposit information');
    });

    it('renders notification settings breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.NOTIFICATION_SETTINGS);

      expect(breadcrumbList[0].label).to.equal('Home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Notification settings');
    });

    it('renders connected apps breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.CONNECTED_APPLICATIONS);

      expect(breadcrumbList[0].label).to.equal('Home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Connected apps');
    });
  });
});
