import React from 'react';
import { useSelector } from 'react-redux';
import { toggleValuesSelector } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const actionPrefix = 'MHV Secondary Nav';

/**
 * MHV secondary navigation items. Note the first item is the home link.
 */
export const mhvSecNavItems = [
  {
    title: 'My HealtheVet',
    actionName: `${actionPrefix} - My HealtheVet`,
    icon: 'home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    actionName: `${actionPrefix} - Appointments`,
    abbreviation: 'Appts',
    ariaLabel: 'Appointments',
    icon: 'calendar_today',
    href: `/my-health/appointments`,
  },
  {
    title: 'Messages',
    actionName: `${actionPrefix} - Messages`,
    icon: 'forum',
    href: `/my-health/secure-messages`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    actionName: `${actionPrefix} - Medications`,
    icon: 'pill',
    href: '/my-health/medications/about',
    appRootUrl: '/my-health/medications',
  },
  {
    title: 'Records',
    actionName: `${actionPrefix} - Records`,
    icon: 'note_add',
    href: `/my-health/medical-records`,
  },
];

/**
 * MHV secondary navigation bar.
 * @returns the navigation bar
 */
const MhvSecondaryNav = () => {
  const { loading = true } = useSelector(toggleValuesSelector);

  return <MhvSecondaryNavMenu items={mhvSecNavItems} loading={loading} />;
};

export default MhvSecondaryNav;
