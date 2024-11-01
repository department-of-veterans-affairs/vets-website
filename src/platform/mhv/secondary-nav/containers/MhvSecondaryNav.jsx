import React from 'react';
import { useSelector } from 'react-redux';
import MhvSecondaryNavMenu from '../components/MhvSecondaryNavMenu';

const actionPrefix = 'MHV Secondary Nav';

const medicalRecordsLink = {
  title: 'Records',
  actionName: `${actionPrefix} - Records`,
  icon: 'note_add',
  href: `/medical-records`,
};

const transitionalMedicalRecordsLink = {
  ...medicalRecordsLink,
  href: '/records',
};

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
    href: `/appointments`,
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
    mhvIntegrationMedicalRecordsToPhase1 = false,
  } = useSelector(state => state.featureToggles);

  if (loading) return <></>;

  // Unified Mhv SPA - skip Medical Records
  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  if (
    mhvTransitionalMedicalRecordsLandingPage &&
    !mhvIntegrationMedicalRecordsToPhase1
  ) {
    items.push(transitionalMedicalRecordsLink);
  } else {
    // items.push(medicalRecordsLink);
    items.push(transitionalMedicalRecordsLink);
  }

  return <MhvSecondaryNavMenu items={items} />;
};

export default MhvSecondaryNav;
