import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

// mapping of toxic exposure error key to page
const teErrorToPage = {
  'toxicExposure.gulfWar1990Details.afghanistan.startDate':
    'gulf-war-1990-location-afghanistan',
  'toxicExposure.gulfWar1990Details.afghanistan.endDate':
    'gulf-war-1990-location-afghanistan',
  'toxicExposure.gulfWar1990Details.bahrain.startDate':
    'gulf-war-1990-location-bahrain',
  'toxicExposure.gulfWar1990Details.bahrain.endDate':
    'gulf-war-1990-location-bahrain',
  'toxicExposure.gulfWar1990Details.egypt.startDate':
    'gulf-war-1990-location-egypt',
  'toxicExposure.gulfWar1990Details.egypt.endDate':
    'gulf-war-1990-location-egypt',
  'toxicExposure.gulfWar1990Details.iraq.startDate':
    'gulf-war-1990-location-iraq',
  'toxicExposure.gulfWar1990Details.iraq.endDate':
    'gulf-war-1990-location-iraq',
  'toxicExposure.gulfWar1990Details.israel.startDate':
    'gulf-war-1990-location-israel',
  'toxicExposure.gulfWar1990Details.israel.endDate':
    'gulf-war-1990-location-israel',
  'toxicExposure.gulfWar1990Details.jordan.startDate':
    'gulf-war-1990-location-jordan',
  'toxicExposure.gulfWar1990Details.jordan.endDate':
    'gulf-war-1990-location-jordan',
  'toxicExposure.gulfWar1990Details.kuwait.startDate':
    'gulf-war-1990-location-kuwait',
  'toxicExposure.gulfWar1990Details.kuwait.endDate':
    'gulf-war-1990-location-kuwait',
  'toxicExposure.gulfWar1990Details.neutralzone.startDate':
    'gulf-war-1990-location-neutralzone',
  'toxicExposure.gulfWar1990Details.neutralzone.endDate':
    'gulf-war-1990-location-neutralzone',
  'toxicExposure.gulfWar1990Details.oman.startDate':
    'gulf-war-1990-location-oman',
  'toxicExposure.gulfWar1990Details.oman.endDate':
    'gulf-war-1990-location-oman',
  'toxicExposure.gulfWar1990Details.qatar.startDate':
    'gulf-war-1990-location-qatar',
  'toxicExposure.gulfWar1990Details.qatar.endDate':
    'gulf-war-1990-location-qatar',
  'toxicExposure.gulfWar1990Details.saudiarabia.startDate':
    'gulf-war-1990-location-saudiarabia',
  'toxicExposure.gulfWar1990Details.saudiarabia.endDate':
    'gulf-war-1990-location-saudiarabia',
  'toxicExposure.gulfWar1990Details.somalia.startDate':
    'gulf-war-1990-location-somalia',
  'toxicExposure.gulfWar1990Details.somalia.endDate':
    'gulf-war-1990-location-somalia',
  'toxicExposure.gulfWar1990Details.syria.startDate':
    'gulf-war-1990-location-syria',
  'toxicExposure.gulfWar1990Details.syria.endDate':
    'gulf-war-1990-location-syria',
  'toxicExposure.gulfWar1990Details.uae.startDate':
    'gulf-war-1990-location-uae',
  'toxicExposure.gulfWar1990Details.uae.endDate': 'gulf-war-1990-location-uae',
  'toxicExposure.gulfWar1990Details.turkey.startDate':
    'gulf-war-1990-location-turkey',
  'toxicExposure.gulfWar1990Details.turkey.endDate':
    'gulf-war-1990-location-turkey',
  'toxicExposure.gulfWar1990Details.waters.startDate':
    'gulf-war-1990-location-waters',
  'toxicExposure.gulfWar1990Details.waters.endDate':
    'gulf-war-1990-location-waters',
  'toxicExposure.gulfWar1990Details.airspace.startDate':
    'gulf-war-1990-location-airspace',
  'toxicExposure.gulfWar1990Details.airspace.endDate':
    'gulf-war-1990-location-airspace',
  'toxicExposure.gulfWar2001Details.djibouti.startDate':
    'gulf-war-2001-location-djibouti',
  'toxicExposure.gulfWar2001Details.djibouti.endDate':
    'gulf-war-2001-location-djibouti',
  'toxicExposure.gulfWar2001Details.lebanon.startDate':
    'gulf-war-2001-location-lebanon',
  'toxicExposure.gulfWar2001Details.lebanon.endDate':
    'gulf-war-2001-location-lebanon',
  'toxicExposure.gulfWar2001Details.uzbekistan.startDate':
    'gulf-war-2001-location-uzbekistan',
  'toxicExposure.gulfWar2001Details.uzbekistan.endDate':
    'gulf-war-2001-location-uzbekistan',
  'toxicExposure.gulfWar2001Details.yemen.startDate':
    'gulf-war-2001-location-yemen',
  'toxicExposure.gulfWar2001Details.yemen.endDate':
    'gulf-war-2001-location-yemen',
  'toxicExposure.gulfWar2001Details.airspace.startDate':
    'gulf-war-2001-location-airspace',
  'toxicExposure.gulfWar2001Details.airspace.endDate':
    'gulf-war-2001-location-airspace',
  'toxicExposure.herbicideDetails.cambodia.startDate':
    'herbicide-location-cambodia',
  'toxicExposure.herbicideDetails.cambodia.endDate':
    'herbicide-location-cambodia',
  'toxicExposure.herbicideDetails.guam.startDate': 'herbicide-location-guam',
  'toxicExposure.herbicideDetails.guam.endDate': 'herbicide-location-guam',
  'toxicExposure.herbicideDetails.koreandemilitarizedzone.startDate':
    'herbicide-location-koreandemilitarizedzone',
  'toxicExposure.herbicideDetails.koreandemilitarizedzone.endDate':
    'herbicide-location-koreandemilitarizedzone',
  'toxicExposure.herbicideDetails.johnston.startDate':
    'herbicide-location-johnston',
  'toxicExposure.herbicideDetails.johnston.endDate':
    'herbicide-location-johnston',
  'toxicExposure.herbicideDetails.laos.startDate': 'herbicide-location-laos',
  'toxicExposure.herbicideDetails.laos.endDate': 'herbicide-location-laos',
  'toxicExposure.herbicideDetails.c123.startDate': 'herbicide-location-c123',
  'toxicExposure.herbicideDetails.c123.endDate': 'herbicide-location-c123',
  'toxicExposure.herbicideDetails.thailand.startDate':
    'herbicide-location-thailand',
  'toxicExposure.herbicideDetails.thailand.endDate':
    'herbicide-location-thailand',
  'toxicExposure.herbicideDetails.vietnam.startDate':
    'herbicide-location-vietnam',
  'toxicExposure.herbicideDetails.vietnam.endDate':
    'herbicide-location-vietnam',
  'toxicExposure.otherExposuresDetails.asbestos.startDate':
    'additional-exposure-asbestos',
  'toxicExposure.otherExposuresDetails.asbestos.endDate':
    'additional-exposure-asbestos',
  'toxicExposure.otherExposuresDetails.chemical.startDate':
    'additional-exposure-chemical',
  'toxicExposure.otherExposuresDetails.chemical.endDate':
    'additional-exposure-chemical',
  'toxicExposure.otherExposuresDetails.water.startDate':
    'additional-exposure-water',
  'toxicExposure.otherExposuresDetails.water.endDate':
    'additional-exposure-water',
  'toxicExposure.otherExposuresDetails.mos.startDate':
    'additional-exposure-mos',
  'toxicExposure.otherExposuresDetails.mos.endDate': 'additional-exposure-mos',
  'toxicExposure.otherExposuresDetails.mustardgas.startDate':
    'additional-exposure-mustardgas',
  'toxicExposure.otherExposuresDetails.mustardgas.endDate':
    'additional-exposure-mustardgas',
  'toxicExposure.otherExposuresDetails.radiation.startDate':
    'additional-exposure-radiation',
  'toxicExposure.otherExposuresDetails.radiation.endDate':
    'additional-exposure-radiation',
  'toxicExposure.otherHerbicideLocations.description': 'herbicideLocations',
  'toxicExposure.otherHerbicideLocations.startDate': 'herbicide-location-other',
  'toxicExposure.otherHerbicideLocations.endDate': 'herbicide-location-other',
  'toxicExposure.specifyOtherExposures.description': 'additional-exposures',
  'toxicExposure.specifyOtherExposures.startDate': 'additional-exposure-other',
  'toxicExposure.specifyOtherExposures.endDate': 'additional-exposure-other',
};

// Link text for review & submit page errors
// key = "name" from `form.formErrors.errors`
// see src/platform/forms-system/docs/reviewErrors.md
export default {
  servicePeriods:
    'Military service history (fill in any missing information for branch of service or service start and end dates)',
  servedInCombatZonePost911:
    'Did you serve in a combat zone after September 11, 2001? (select yes or no)',
  ratedDisabilities:
    'Rated disability (select the disability you’re filing for)',
  // newDisabilities is returning null so it doesn't render because a missing
  // "condition" will show the error
  newDisabilities: () => null,
  condition: index =>
    `New conditions (in the ${numberToWords(
      index + 1,
    )} section, enter a condition or select one from the list)`,
  cause: 'What caused this condition? (select from the list of causes)',
  'view:hasMilitaryRetiredPay':
    'Have you ever received military retirement pay? (select yes or no)',
  hasTrainingPay:
    'Do you expect to receive active or inactive duty training pay? (select yes or no)',
  'view:powStatus': 'Are you a former POW? (select yes or no)',
  'view:selectableEvidenceTypes':
    'What type of evidence do you want us to review as part of your claim? (select at least one type)',
  primaryPhone: 'Contact information (enter your phone number)',
  emailAddress: 'Contact information (enter your email address)',
  city: 'Contact information (enter a city for your mailing address)',
  addressLine1: 'Contact information (enter a street address)',
  state: 'Contact information (enter a state for your mailing address)',
  zipCode: 'Contact information (enter a postal code for your mailing address)',
  homelessOrAtRisk:
    'Are you homeless or at risk of becoming homeless? (select one of the answers)',
  isVaEmployee: 'Are you a VA employee? (select yes or no)',
  'toxicExposure.gulfWar1990Details.afghanistan.startDate':
    'Service start date for Afghanistan',
  'toxicExposure.gulfWar1990Details.afghanistan.endDate':
    'Service end date for Afghanistan',
  'toxicExposure.gulfWar1990Details.bahrain.startDate':
    'Service start date for Bahrain',
  'toxicExposure.gulfWar1990Details.bahrain.endDate':
    'Service end date for Bahrain',
  'toxicExposure.gulfWar1990Details.egypt.startDate':
    'Service start date for Egypt',
  'toxicExposure.gulfWar1990Details.egypt.endDate':
    'Service end date for Egypt',
  'toxicExposure.gulfWar1990Details.iraq.startDate':
    'Service start date for Iraq',
  'toxicExposure.gulfWar1990Details.iraq.endDate': 'Service end date for Iraq',
  'toxicExposure.gulfWar1990Details.israel.startDate':
    'Service start date for Israel',
  'toxicExposure.gulfWar1990Details.israel.endDate':
    'Service end date for Israel',
  'toxicExposure.gulfWar1990Details.jordan.startDate':
    'Service start date for Jordan',
  'toxicExposure.gulfWar1990Details.jordan.endDate':
    'Service end date for Jordan',
  'toxicExposure.gulfWar1990Details.kuwait.startDate':
    'Service start date for Kuwait',
  'toxicExposure.gulfWar1990Details.kuwait.endDate':
    'Service end date for Kuwait',
  'toxicExposure.gulfWar1990Details.neutralzone.startDate':
    'Service start date for the neutral zone between Iraq and Saudi Arabia',
  'toxicExposure.gulfWar1990Details.neutralzone.endDate':
    'Service end date for the neutral zone between Iraq and Saudi Arabia',
  'toxicExposure.gulfWar1990Details.oman.startDate':
    'Service start date for Oman',
  'toxicExposure.gulfWar1990Details.oman.endDate': 'Service end date for Oman',
  'toxicExposure.gulfWar1990Details.qatar.startDate':
    'Service start date for Qatar',
  'toxicExposure.gulfWar1990Details.qatar.endDate':
    'Service end date for Qatar',
  'toxicExposure.gulfWar1990Details.saudiarabia.startDate':
    'Service start date for Saudi Arabia',
  'toxicExposure.gulfWar1990Details.saudiarabia.endDate':
    'Service end date for Saudi Arabia',
  'toxicExposure.gulfWar1990Details.somalia.startDate':
    'Service start date for Somalia',
  'toxicExposure.gulfWar1990Details.somalia.endDate':
    'Service end date for Somalia',
  'toxicExposure.gulfWar1990Details.syria.startDate':
    'Service start date for Syria',
  'toxicExposure.gulfWar1990Details.syria.endDate':
    'Service end date for Syria',
  'toxicExposure.gulfWar1990Details.uae.startDate':
    'Service start date for The United Arab Emirates (UAE)',
  'toxicExposure.gulfWar1990Details.uae.endDate':
    'Service end date for The United Arab Emirates (UAE)',
  'toxicExposure.gulfWar1990Details.turkey.startDate':
    'Service start date for Turkey',
  'toxicExposure.gulfWar1990Details.turkey.endDate':
    'Service end date for Turkey',
  'toxicExposure.gulfWar1990Details.waters.startDate':
    'Service start date for Oman',
  'toxicExposure.gulfWar1990Details.waters.endDate':
    'Service end date for Oman',
  'toxicExposure.gulfWar1990Details.airspace.startDate':
    'Service start date for the airspace above Gulf War locations on or after August 2, 1990',
  'toxicExposure.gulfWar1990Details.airspace.endDate':
    'Service end date for Gulf War locations on or after August 2, 1990',
  'toxicExposure.gulfWar2001Details.djibouti.startDate':
    'Service start date for Djibouti',
  'toxicExposure.gulfWar2001Details.djibouti.endDate':
    'Service end date for Djibouti',
  'toxicExposure.gulfWar2001Details.lebanon.startDate':
    'Service start date for Lebanon',
  'toxicExposure.gulfWar2001Details.lebanon.endDate':
    'Service end date for Lebanon',
  'toxicExposure.gulfWar2001Details.uzbekistan.startDate':
    'Service start date for Uzbekistan',
  'toxicExposure.gulfWar2001Details.uzbekistan.endDate':
    'Service end date for Uzbekistan',
  'toxicExposure.gulfWar2001Details.yemen.startDate':
    'Service start date for Yemen',
  'toxicExposure.gulfWar2001Details.yemen.endDate':
    'Service end date for Yemen',
  'toxicExposure.gulfWar2001Details.airspace.startDate':
    'Service start date for the airspace above Service post-9/11 locations',
  'toxicExposure.gulfWar2001Details.airspace.endDate':
    'Service end date for the airspace above Service post-9/11 locations',
  'toxicExposure.herbicideDetails.cambodia.startDate':
    'Service start date for Cambodia at Mimot or Krek, Kampong Cham Province',
  'toxicExposure.herbicideDetails.cambodia.endDate':
    'Service end date for Cambodia at Mimot or Krek, Kampong Cham Province',
  'toxicExposure.herbicideDetails.guam.startDate':
    'Service start date for Guam, American Samoa, or their territorial waters',
  'toxicExposure.herbicideDetails.guam.endDate':
    'Service end date for Guam, American Samoa, or their territorial waters',
  'toxicExposure.herbicideDetails.koreandemilitarizedzone.startDate':
    'Service start date for In or near the Korean demilitarized zone',
  'toxicExposure.herbicideDetails.koreandemilitarizedzone.endDate':
    'Service end date for In or near the Korean demilitarized zone',
  'toxicExposure.herbicideDetails.johnston.startDate':
    'Service start date for Johnston Atoll or on a ship that called at Johnston Atoll',
  'toxicExposure.herbicideDetails.johnston.endDate':
    'Service end date for Johnston Atoll or on a ship that called at Johnston Atoll',
  'toxicExposure.herbicideDetails.laos.startDate':
    'Service start date for Laos',
  'toxicExposure.herbicideDetails.laos.endDate': 'Service end date for Laos',
  'toxicExposure.herbicideDetails.c123.startDate':
    'Service start date for Somewhere you had contact with C-123 airplanes while serving in the Air Force or the Air Force Reserves',
  'toxicExposure.herbicideDetails.c123.endDate':
    'Service end date for Somewhere you had contact with C-123 airplanes while serving in the Air Force or the Air Force Reserves',
  'toxicExposure.herbicideDetails.thailand.startDate':
    'Service start date for a U.S. or Royal Thai military base in Thailand',
  'toxicExposure.herbicideDetails.thailand.endDate':
    'Service end date for a U.S. or Royal Thai military base in Thailand',
  'toxicExposure.herbicideDetails.vietnam.startDate':
    'Service start date for Vietnam or the waters in or off of Vietnam',
  'toxicExposure.herbicideDetails.vietnam.endDate':
    'Service end date for Vietnam or the waters in or off of Vietnam',
  'toxicExposure.otherHerbicideLocations.description':
    'Agent Orange other locations',
  'toxicExposure.otherExposuresDetails.asbestos.startDate':
    'Exposure start date for Asbestos',
  'toxicExposure.otherExposuresDetails.asbestos.endDate':
    'Exposure end date for Asbestos',
  'toxicExposure.otherExposuresDetails.chemical.startDate':
    'Exposure start date for chemical and biological warfare testing through Project 112 or Project Shipboard Hazard and Defense (SHAD)',
  'toxicExposure.otherExposuresDetails.chemical.endDate':
    'Exposure end date for chemical and biological warfare testing through Project 112 or Project Shipboard Hazard and Defense (SHAD)',
  'toxicExposure.otherExposuresDetails.water.startDate':
    'Exposure start date for contaminated water at Camp Lejeune or MCAS New River, North Carolina',
  'toxicExposure.otherExposuresDetails.water.endDate':
    'Exposure end date for contaminated water at Camp Lejeune or MCAS New River, North Carolina',
  'toxicExposure.otherExposuresDetails.mos.startDate':
    'Exposure start date for Military Occupational Specialty (MOS)-related toxin',
  'toxicExposure.otherExposuresDetails.mos.endDate':
    'Exposure end date for Military Occupational Specialty (MOS)-related toxin',
  'toxicExposure.otherExposuresDetails.mustardgas.startDate':
    'Exposure start date for Mustard Gas',
  'toxicExposure.otherExposuresDetails.mustardgas.endDate':
    'Exposure end date for Mustard Gas',
  'toxicExposure.otherExposuresDetails.radiation.startDate':
    'Exposure start date for Radiation',
  'toxicExposure.otherExposuresDetails.radiation.endDate':
    'Exposure end date for Radiation',
  'toxicExposure.specifyOtherExposures.description':
    'Other toxic exposures not listed',
  'toxicExposure.specifyOtherExposures.startDate':
    'Exposure start date for other toxic exposures',
  'toxicExposure.specifyOtherExposures.endDate':
    'Exposure end date for other toxic exposures',
  _override: error => {
    if (Object.keys(teErrorToPage).includes(error)) {
      return {
        chapterKey: 'disabilities',
        pageKey: teErrorToPage[error],
      };
    }

    // always return null for non-matches
    return null;
  },
};
