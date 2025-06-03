import React from 'react';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const actionPrefix = 'MHV Secondary Nav';

/**
 * MHV secondary navigation items. Note the first item is the home link.
 *
 * Notes:
 * - The title is the text displayed in the navigation.
 * - The abbreviation is an optional short version of the title, used for smaller screens.
 * - The ariaLabel is paired with the abbreviation and it is used for accessibility purposes.
 * - The actionName is used for analytics tracking.
 * - The icon is the name of the icon to be displayed in the navigation.
 * - The href is the link to the page.
 * - The appRootUrl is paired with the href it is used to determine the root of the app for the navigation.
 *   - If the appRootUrl is not provided, it defaults to the href.
 *   - If the appRootUrl is different from the href, it should be provided.
 * - appRootUrl is required if it's different from href.
 *   - Example:
 *   - appRootUrl: '/my-health/secure-messages'      // root of the app
 *   - href: '/my-health/secure-messages/inbox'      // specific sub-page (inbox)
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
    appRootUrl: '/my-health/secure-messages',
    href: `/my-health/secure-messages/inbox`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    actionName: `${actionPrefix} - Medications`,
    icon: 'pill',
    href: '/my-health/medications',
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
  return <MhvSecondaryNavMenu items={mhvSecNavItems} />;
};

export default MhvSecondaryNav;
