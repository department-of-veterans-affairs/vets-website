import { expect } from 'chai';

import get from 'platform/utilities/data/get';
import * as pages from '../pages';

// Some pages have duplicate properties on purpose. These pages add new information to existing
//  objects and should be ignored.
const ignoreList = {
  // propName: ['list', 'of', 'pages'],
  newDisabilities: [
    'addDisabilities',
    'newDisabilityFollowUp',
    'unemployabilityDisabilities',
  ],
  ratedDisabilities: ['unemployabilityDisabilities', 'ratedDisabilities'],
  serviceInformation: [
    'federalOrders',
    'reservesNationalGuardService',
    'militaryHistory',
    'militaryHistory',
    'reservesNationalGuardService',
    'separationLocation',
  ],
  toxicExposure: [
    'toxicExposureConditions',
    'gulfWar1990Locations',
    'gulfWar2001Locations',
    'herbicideLocations',
    'herbicideOtherLocations',
    'otherExposures',
    'specifyOtherExposures',
  ],
  unemployability: [
    'medicalCare',
    'hospitalizationHistory',
    'unemployabilityDoctorCare',
    'unemployabilityDates',
    'incomeDetails',
    'employmentHistory',
    'recentEarnedIncome',
    'supplementalBenefits',
    'militaryDutyImpact',
    'recentJobApplications',
    'pastEducationTraining',
    'recentEducationTraining',
    'unemployabilityAdditionalInformation',
    'uploadUnemployabilitySupportingDocumentsChoice',
    'uploadUnemployabilitySupportingDocuments',
    'unemployabilityCertification',
  ],
};

describe('Root property names', () => {
  it('should not be duplicated', () => {
    const properties = new Map();
    const duplicatedProperties = {};

    // these properties are used on the original claim and BDD evidence type pages
    const duplicatedPropertiesToIgnore = [
      'view:hasEvidence',
      'view:selectableEvidenceTypes',
      'view:evidenceTypeHelp',
    ];

    Object.keys(pages).forEach(pageName => {
      // Loop through the properties on the schema for a page
      Object.keys(get(`${pageName}.schema.properties`, pages, {})).forEach(
        propName => {
          // Compile a list of duplicate property names
          if (
            properties.has(propName) &&
            !get(propName, ignoreList, []).includes(pageName)
          ) {
            if (duplicatedProperties[propName]) {
              duplicatedProperties[propName].push(pageName);
            } else if (!duplicatedPropertiesToIgnore.includes(propName)) {
              duplicatedProperties[propName] = [
                properties.get(propName),
                pageName,
              ];
            }
          }
          properties.set(propName, pageName);
        },
      );
    });

    // Print out a readable list
    Object.keys(duplicatedProperties).forEach(propName => {
      // eslint-disable-next-line no-console
      console.log(
        `${propName} is found on the following pages: ${duplicatedProperties[
          propName
        ].join(', ')}`,
      );
    });

    expect(Object.keys(duplicatedProperties)).to.be.empty;
  });
});
