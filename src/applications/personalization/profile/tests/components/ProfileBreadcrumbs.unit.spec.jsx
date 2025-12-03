import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import FEATURE_FLAGS from '~/platform/utilities/feature-toggles/featureFlagNames';
import { ProfileBreadcrumbs } from '../../components/ProfileBreadcrumbs';
import { PROFILE_PATHS } from '../../constants';
import { getRoutesForNav } from '../../routesForNav';

const setup = (path, profile2Enabled) => {
  const routes = getRoutesForNav({ profile2Enabled });
  const view = renderInReduxProvider(
    <MemoryRouter initialEntries={[path]}>
      <ProfileBreadcrumbs routes={routes} />
    </MemoryRouter>,
    {
      initialState: {
        featureToggles: {
          loading: false,
          [FEATURE_FLAGS.profile2Enabled]: profile2Enabled,
        },
      },
    },
  );

  const breadcrumbList = JSON.parse(
    view.getByTestId('profile-breadcrumbs-wrapper').dataset.breadcrumbsJson,
  );

  return { breadcrumbList };
};

describe('<ProfileBreadcrumbs />', () => {
  it('should render "VA.gov home" and "Profile" as base breadcrumbs', () => {
    const { breadcrumbList } = setup(PROFILE_PATHS.PROFILE_ROOT, false);

    expect(breadcrumbList[0].label).to.equal('VA.gov home');
    expect(breadcrumbList[1].label).to.equal('Profile');
  });

  describe('should render additional breadcrumb based on route', () => {
    it('renders personal information breadcrumb', () => {
      const { breadcrumbList } = setup(
        PROFILE_PATHS.PERSONAL_INFORMATION,
        false,
      );

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Personal information');
    });

    it('renders contact information breadcrumb', () => {
      const { breadcrumbList } = setup(
        PROFILE_PATHS.CONTACT_INFORMATION,
        false,
      );

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Contact information');
    });

    it('renders military information breadcrumb', () => {
      const { breadcrumbList } = setup(
        PROFILE_PATHS.MILITARY_INFORMATION,
        false,
      );

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Military information');
    });

    it('renders direct deposit breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.DIRECT_DEPOSIT, false);

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Direct deposit information');
    });

    it('renders notification settings breadcrumb', () => {
      const { breadcrumbList } = setup(
        PROFILE_PATHS.NOTIFICATION_SETTINGS,
        false,
      );

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Notification settings');
    });

    it('renders connected apps breadcrumb', () => {
      const { breadcrumbList } = setup(
        PROFILE_PATHS.CONNECTED_APPLICATIONS,
        false,
      );

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Connected apps');
    });

    it('renders root breadcrumb when path is invalid', () => {
      const { breadcrumbList } = setup('/profile/invalid-path', false);
      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
    });
  });

  describe('should support tier 2 pages with profile2 is enabled', () => {
    it('renders personal information breadcrumb', () => {
      const { breadcrumbList } = setup(
        PROFILE_PATHS.PERSONAL_INFORMATION,
        true,
      );

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Personal information');
    });

    it('renders financial information breadcrumb', () => {
      const { breadcrumbList } = setup(
        PROFILE_PATHS.FINANCIAL_INFORMATION,
        true,
      );

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Financial information');
    });

    it('renders direct deposit breadcrumb', () => {
      const { breadcrumbList } = setup(PROFILE_PATHS.DIRECT_DEPOSIT, true);

      expect(breadcrumbList[0].label).to.equal('VA.gov home');
      expect(breadcrumbList[1].label).to.equal('Profile');
      expect(breadcrumbList[2].label).to.equal('Financial information');
      expect(breadcrumbList[3].label).to.equal('Direct deposit information');
    });
  });
});
