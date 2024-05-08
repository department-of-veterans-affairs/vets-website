import React from 'react';
import { useSelector } from 'react-redux';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const medicalRecordsLink = {
  title: 'Records',
  icon: 'note_add',
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
    icon: 'home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    abbreviation: 'Appts',
    icon: 'calendar_today',
    href: `/my-health/appointments`,
  },
  {
    title: 'Messages',
    icon: 'forum',
    href: `/my-health/secure-messages`,
  },
  {
    title: 'Medications',
    abbreviation: 'Meds',
    icon: 'medication',
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
