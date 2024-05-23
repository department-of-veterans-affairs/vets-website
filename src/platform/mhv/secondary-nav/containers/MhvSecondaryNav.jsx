import React from 'react';
import { useSelector } from 'react-redux';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const actionPrefix = 'MHV Secondary Nav';

const medicalRecordsLink = {
  title: 'Records',
  actionName: `${actionPrefix} - Records`,
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
    actionName: `${actionPrefix} - My HealtheVet`,
    icon: 'home',
    href: '/my-health',
  },
  {
    title: 'Appointments',
    actionName: `${actionPrefix} - Appointments`,
    abbreviation: 'Appts',
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
    icon: 'medication',
    href: '/my-health/medications/about',
    appRootUrl: '/my-health/medications',
  },
];

/**
 * MHV secondary navigation bar.
 * @returns the navigation bar
 */
const MhvSecondaryNav = () => {
  const items = [...mhvSecNavItems];
  const {
    loading,
    mhvTransitionalMedicalRecordsLandingPage = false,
  } = useSelector(state => state.featureToggles);

  if (loading) return <></>;

  if (mhvTransitionalMedicalRecordsLandingPage) {
    items.push(transitionalMedicalRecordsLink);
  } else {
    items.push(medicalRecordsLink);
  }

  return <MhvSecondaryNavMenu items={items} />;
};

export default MhvSecondaryNav;
