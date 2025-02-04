import React from 'react';
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
    href: '/',
  },
  {
    title: 'Appointments',
    actionName: `${actionPrefix} - Appointments`,
    abbreviation: 'Appts',
    ariaLabel: 'Appointments',
    icon: 'calendar_today',
    href: `/my-appointments`,
  },
  {
    title: 'Messages',
    actionName: `${actionPrefix} - Messages`,
    icon: 'forum',
    href: `/my-secure-messages`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    actionName: `${actionPrefix} - Medications`,
    icon: 'pill',
    href: '/my-medications/about',
    appRootUrl: '/my-medications',
  },
  {
    title: 'Records',
    actionName: `${actionPrefix} - Records`,
    icon: 'note_add',
    href: `/my-medical-records`,
  },
];

/**
 * MHV secondary navigation bar.
 * @returns the navigation bar
 */
const MhvSecondaryNav = () => {
  const items = [...mhvSecNavItems];

  return <MhvSecondaryNavMenu items={items} />;
};

export default MhvSecondaryNav;
