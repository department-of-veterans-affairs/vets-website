import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

/*
These lists were created by taking the list of supported facilities from
https://mobile.va.gov/app/va-health-chat, sorting it alphabetically, and
manually adding their facility ID from
https://github.com/department-of-veterans-affairs/vets-json-schema/blob/153ec0723d1abe66756558b1977c8114c8b734b4/src/common/va-medical-facilities.js


These lists were created on 2020-03-19. Future updates could be made by taking
the updated list of facilities from https://mobile.va.gov/app/va-health-chat,
determining which facilities have been added and removed, and updating these
arrays as needed

- We will only actually be using the facility IDs, but I wanted to keep them
  with the facility name that was copied from the source list.
- Some facility names could not be mapped to a facility ID. In those cases I
  used 000 as a placeholder ID.
*/
const visn8Facilities = [
  { name: 'Arecibo VA Clinic', id: '672GC' },
  { name: 'Bay Pines VA Healthcare System', id: '516' },
  { name: 'Boca Raton VA Clinic', id: '548GD' },
  { name: 'Bradenton VA Clinic', id: '516GD' },
  { name: 'Brooksville VA Clinic', id: '673GC' },
  { name: 'Ceiba VA Community Based Outpatient Clinic', id: '672GD' },
  { name: 'Clermont VA Clinic', id: '675GF' },
  { name: 'Clewiston Outpatient Clinic', id: '000' },
  { name: 'Comerio Rural Outpatient Clinic', id: '672' },
  { name: 'Crossroads VA Clinic', id: '675QD' },
  { name: 'Deerfield Beach VA Clinic', id: '546GH' },
  { name: 'Delray Beach VA Clinic', id: '548GB' },
  { name: 'Deltona Community Based Outpatient Clinic', id: '675GD' },
  { name: 'Eurípides Rubio VA Outpatient Clinic', id: '672B0' },
  { name: 'Fort Pierce VA Clinic', id: '548GA' },
  { name: 'Guayama Community Based Outpatient Clinic', id: '672GE' },
  { name: 'Hollywood VA Clinic', id: '546GF' },
  { name: 'Homestead VA Clinic', id: '546GC' },
  { name: 'Jacksonville 1 VA Clinic', id: '573BY' },
  { name: 'James A. Haley Veterans’ Hospital', id: '673' },
  { name: 'Key Largo VA Clinic', id: '546GE' },
  { name: 'Key West VA Clinic', id: '546GB' },
  { name: 'Kissimmee VA Clinic', id: '675GC' },
  { name: 'Lake Baldwin VA Clinic', id: '675GG' },
  { name: 'Lake City VA Medical Center', id: '573A4' },
  { name: 'Lakeland VA Clinic', id: '673GB' },
  { name: 'Lee County VA Clinic', id: '516BZ' },
  { name: 'Malcom Randall VA Medical Center', id: '573' },
  { name: 'Maplewood VA Clinic', id: '618GD' },
  { name: 'Marianna VA Clinic', id: '573GK' },
  { name: 'Mayaguez VA Clinic', id: '672BZ' },
  { name: 'Miami Flagler VA Clinic', id: '546GA' },
  { name: 'Miami VA Healthcare System', id: '546B0' },
  { name: 'Naples VA Clinic', id: '516GF' },
  { name: 'New Port Richey VA Clinic', id: '673BZ' },
  { name: 'North Florida/South Georgia Veterans Health System', id: '573' },
  { name: 'Ocala VA Clinic', id: '573GD' },
  { name: 'Okeechobee VA Clinic', id: '548GF' },
  { name: 'Orlando VA Healthcare System', id: '675' },
  { name: 'Palatka VA Clinic', id: '573GL' },
  { name: 'Palm Harbor VA Clinic', id: '516GC' },
  { name: 'Pembroke Pines VA Clinic', id: '546GD' },
  { name: 'Perry VA Clinic', id: '573GN' },
  { name: 'Port Charlotte VA Clinic', id: '516GE' },
  { name: 'Saint Augustine VA Clinic', id: '573GE' },
  { name: 'Saint Croix VA Clinic', id: '672GA' },
  { name: 'Saint Thomas VA Clinic', id: '672GB' },
  { name: 'Sarasota VA Clinic', id: '516GA' },
  { name: 'Sebring VA Clinic', id: '516GH' },
  { name: 'Southpoint Clinic', id: '573QG' },
  {
    name: 'St Lucie County PTSD Clinical Team (PCT) Outpatient Program',
    id: '548QA',
  },
  { name: 'St. Petersburg VA Clinic', id: '516GB' },
  { name: 'Stuart VA Clinic', id: '548GC' },
  { name: 'Tavares VA Clinic', id: '675GE' },
  { name: 'The Villages VA Clinic', id: '573GI' },
  { name: 'Utuado VA Clinic', id: '672QB' },
  { name: 'VA Caribbean Healthcare System', id: '000' },
  { name: 'VA Moore Haven Outpatient Clinic', id: '000' },
  { name: 'Valdosta VA Clinic', id: '573GA' },
  { name: 'Vero Beach VA Clinic', id: '548GE' },
  { name: 'Vieques Rural Outpatient Clinic', id: '672QC' },
  { name: 'Viera VA Clinic', id: '675GA' },
  { name: 'West Palm Beach VA Medical Center', id: '548' },
  { name: 'Zephyrhills VA Clinic', id: '673GF' },
  { name: "James A. Haley Veterans' Hospital Primary Care Annex", id: '673' },
  { name: "Sergeant Ernest I. 'Boots' Thomas VA Clinic", id: '573GF' },
  { name: "St. Mary's VA Clinic", id: '573GJ' },
  { name: "William 'Bill' Kling VA Outpatient Clinic", id: '546BZ' },
  { name: "William V. Chappell, Jr. Veterans' Outpatient Clinic", id: '675GB' },
];

const visn23Facilities = [
  { name: 'Alexandria Community Based Outpatient Clinic', id: '656GC' },
  { name: 'Brainerd VA Clinic', id: '656GA' },
  { name: 'Fort Snelling VA Clinic', id: '618QA' },
  { name: 'Hayward VA Clinic', id: '618GH' },
  { name: 'Maplewood VA Clinic', id: '618GD' },
  { name: 'Max J. Beilke VA Outpatient Clinic', id: '656GC' },
  { name: 'Minneapolis VA Medical Center', id: '618' },
  { name: 'Montevideo VA Clinic', id: '656GB' },
  { name: 'Northwest Metro VA Clinic', id: '618GI' },
  { name: 'Rice Lake VA Clinic', id: '618GM' },
  { name: 'Rochester VA Clinic', id: '618GG' },
  { name: 'St. Cloud VA Medical Center', id: '656' },
  { name: 'Twin Ports VA Clinic', id: '618BY' },
];

const testingFacilities = [
  // These two are not real facility IDs but allow for testing in staging with
  // judy.morrison@id.me, cecil.morgan@id.me, chester.morgan@id.me,
  // nelson.morrison@id.me
  { name: '648', id: '648GC' },
  { name: 'zzzFakeTestFacility 1', id: '983' },
  { name: 'zzzFakeTestFacility 2', id: '984' },
];

// 2020-03-24: removed VISN8 facilities from eligibleFacilities
const eligibleFacilities = [...visn23Facilities, ...testingFacilities];

/**
 * This filters the list of VISN8 facilities and returns just a set of
 * the three-digit health system IDs that appear in that list.
 */
const visn8Systems = new Set(
  visn8Facilities.map(facility => facility.id.substring(0, 3)),
);

/**
 * This filters the list of VISN23 facilities and returns just a set of
 * the three-digit health system IDs that appear in that list.
 */
const visn23Systems = new Set(
  visn23Facilities.map(facility => facility.id.substring(0, 3)),
);

/**
 * This filters the full list of eligible facilities and returns just a set of
 * the three-digit health system IDs that appear in that list.
 */
export const eligibleHealthSystems = new Set(
  // the health system is always the first three digits of a facility ID
  eligibleFacilities.map(facility => facility.id.substring(0, 3)),
);

export const getChatHours = facilityId => {
  const visn8Hours = '8:00 a.m. to 4:00 p.m., Monday through Friday';
  const visn23Hours = '7:30 a.m. to 4:30 p.m., Monday through Friday';
  const testHours = '9:00 a.m. to 5:00 p.m., Monday through Friday';
  if (visn8Systems.has(facilityId)) {
    return visn8Hours;
  }
  if (visn23Systems.has(facilityId)) {
    return visn23Hours;
  }
  return testHours;
};

export const COVID19Alert = ({ facilityId }) => (
  <va-alert isVisible status="info">
    <h2 slot="headline">
      You may be eligible to use health chat as part of our pilot
    </h2>
    <p>
      If you have questions about COVID-19 or general health concerns, you may
      be able to chat with a VA staff person, on desktop or as a mobile app.
      Health chat is available at no-cost, {getChatHours(facilityId)}, to any
      Veteran whose VA facility is part of the pilot.
    </p>
    <a
      className="usa-button-primary"
      href="https://mobile.va.gov/app/va-health-chat"
      rel="noopener noreferrer"
      onClick={() => {
        recordEvent({
          event: 'dashboard-navigation',
          'dashboard-action': 'view-link',
          'dashboard-product': 'learn-more-chat',
        });
      }}
    >
      Learn more about VA health chat
    </a>
    <p>
      <strong>Note:</strong> Some VA facilities may be receiving many messages,
      and it may take them time to reply via chat.
    </p>
  </va-alert>
);

COVID19Alert.propTypes = {
  facilityId: PropTypes.string.isRequired,
};
