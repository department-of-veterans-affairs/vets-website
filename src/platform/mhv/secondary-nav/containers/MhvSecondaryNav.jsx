import React from 'react';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';
// import '../sass/mhv-sec-nav.scss';

/**
 * MHV secondary navigation items. Note the first item is the home link.
 */
export const mhvSecNavItems = [
  {
    title: 'My HealtheVet',
    iconClass: 'fas fa-home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    abbreviation: 'Appts',
    iconClass: 'fas fa-calendar',
    href: `/my-health/appointments`,
  },
  {
    title: 'Messages',
    iconClass: 'fas fa-comments',
    href: `/my-health/secure-messages`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    iconClass: 'fas fa-prescription-bottle',
    href: `/my-health/medications`,
  },
  {
    title: 'Records',
    iconClass: 'fas fa-file-medical',
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
