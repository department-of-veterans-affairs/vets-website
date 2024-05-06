import React from 'react';
import { useSelector } from 'react-redux';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const medicalRecordsLink = {
  title: 'Records',
  iconClass: 'fas fa-file-medical',
  href: `/my-health/medical-records`,
};

const transitionalMedicalRecordsLink = {
  ...medicalRecordsLink,
  href: '/my-health/records',
};

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
  medicalRecordsLink,
];

/**
 * MHV secondary navigation bar.
 * @returns the navigation bar
 */
const MhvSecondaryNav = () => {
  const items = [...mhvSecNavItems];
  const { loading, mhvTransitionalMedicalRecordsLandingPage } = useSelector(
    state => state.featureToggles,
  );

  if (loading) return <></>;

  if (mhvTransitionalMedicalRecordsLandingPage) {
    items.pop();
    items.push(transitionalMedicalRecordsLink);
  }

  return <MhvSecondaryNavMenu items={items} />;
};

export default MhvSecondaryNav;
