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
            } else {
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
      // eslint-disable-next-line
      console.log(
        `${propName} is found on the following pages: ${duplicatedProperties[
          propName
        ].join(', ')}`,
      );
    });

    expect(Object.keys(duplicatedProperties)).to.be.empty;
  });
});
