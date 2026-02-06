import React from 'react';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const actionPrefix = 'MHV Secondary Nav';

/**
 * MHV secondary navigation items. Note the first item is the home link.
 *
 * Notes:
 * - `title` is the text displayed in the navigation.
 * - `abbreviation` is an optional short version of the title, used for smaller screens.
 * - `ariaLabel` is paired with the abbreviation and it is used for accessibility purposes.
 * - `actionName` is used for analytics tracking.
 * - `icon` is the name of the icon to be displayed in the navigation.
 * - `href` is the link to the page.
 * - `appRootUrl` is used to determine which secondary navigation item should be marked as
 *   "current" when the navigation link points to a sub-page within the app rather than its root.
 *   If `appRootUrl` differs from the `href`, it must be explicitly defined to ensure the correct
 *   active state is applied (i.e. the appropriate tab is highlighted) in the secondary nav.
 *   Example:
 *     appRootUrl: '/my-health/secure-messages'      // root path of the app
 *     href: '/my-health/secure-messages/inbox'      // specific sub-page (e.g., inbox)
 */
export const mhvSecNavItems = [
  {
    title: 'My HealtheVet',
    actionName: `${actionPrefix} - My HealtheVet`,
    icon: 'home',
    href: '/my-health/',
  },
  {
    title: 'Appointments',
    actionName: `${actionPrefix} - Appointments`,
    abbreviation: 'Appts',
    ariaLabel: 'Appointments',
    icon: 'calendar_today',
    href: `/my-health/appointments/`,
  },
  {
    title: 'Messages',
    actionName: `${actionPrefix} - Messages`,
    icon: 'forum',
    appRootUrl: '/my-health/secure-messages',
    href: `/my-health/secure-messages/inbox/`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    actionName: `${actionPrefix} - Medications`,
    icon: 'pill',
    href: '/my-health/medications/',
  },
  {
    title: 'Records',
    actionName: `${actionPrefix} - Records`,
    icon: 'note_add',
    href: `/my-health/medical-records/`,
  },
];

/**
 * MHV secondary navigation bar.
 * @returns the navigation bar
 */
const MhvSecondaryNav = () => {
  return <MhvSecondaryNavMenu items={mhvSecNavItems} />;
};

export default MhvSecondaryNav;
