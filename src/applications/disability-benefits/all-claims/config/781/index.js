import {
  individualsInvolved,
  individualsInvolvedFollowUp,
  incidentSupport,
  incidentDate,
  incidentLocation,
  secondaryIncidentDate,
  secondaryUploadSources,
  secondaryUploadSourcesChoice,
  secondaryIncidentLocation,
  incidentUnitAssignment,
  secondaryIncidentUnitAssignment,
  incidentDescription,
  secondaryIncidentDescription,
  secondaryIncidentPermissionNotice,
  secondaryIncidentAuthorities,
  ptsdAdditionalEvents,
  ptsdSecondaryAdditionalEvents,
  medals,
  secondaryOtherSources,
  secondaryOtherSourcesHelp,
} from '../../pages';

import {
  isAnswering781Questions,
  isAnswering781aQuestions,
  isUploading781aSupportingDocuments,
  isAddingIndividuals,
  wantsHelpWithOtherSourcesSecondary,
  wantsHelpWithPrivateRecordsSecondary,
  wantsHelpRequestingStatementsSecondary,
} from '../../utils';

const numberToWords = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
  5: 'Sixth',
  6: 'Seventh',
  7: 'Eighth',
  8: 'Ninth',
  9: 'Tenth',
};

// This removes "First " from the title if there is only one incident.
const setReviewTitle = (title, index, formType) => formData => {
  const additionalIncidentKey = `view:enterAdditional${
    formType === '781a' ? 'Secondary' : ''
  }Events${index}`;

  let formattedTitle = title;

  if (formData[additionalIncidentKey]) {
    formattedTitle = `${numberToWords[index]} ${title}`;
  }
  return formattedTitle;
};

export function createFormConfig781(iterations) {
  let configObj = {};
  const formType = '781';
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781 PAGE CONFIGS GO HERE
      [`medals${index}`]: {
        title: setReviewTitle('Medals or citations', index, formType),
        path: `disabilities/ptsd-medals-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: medals.uiSchema(index),
        schema: medals.schema(index),
      },
      [`incidentDate${index}`]: {
        title: setReviewTitle('PTSD incident date', index, formType),
        path: `disabilities/ptsd-incident-date-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentDate.uiSchema(index),
        schema: incidentDate.schema(index),
      },
      [`incidentUnitAssignment${index}`]: {
        title: setReviewTitle('PTSD incident unit assignment', index, formType),
        path: `disabilities/ptsd-incident-unit-assignment-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentUnitAssignment.uiSchema(index),
        schema: incidentUnitAssignment.schema(index),
      },
      [`incidentLocation${index}`]: {
        title: setReviewTitle('PTSD incident location', index, formType),
        path: `disabilities/ptsd-incident-location-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentLocation.uiSchema(index),
        schema: incidentLocation.schema(index),
      },
      [`individualsInvolved${index}`]: {
        title: setReviewTitle(
          'PTSD incident were any individuals involved?',
          index,
          formType,
        ),
        path: `disabilities/ptsd-individuals-involved-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: individualsInvolved.uiSchema(index),
        schema: individualsInvolved.schema(index),
      },
      [`incidentSupport${index}`]: {
        title: setReviewTitle('PTSD incident support', index, formType),
        path: `disabilities/ptsd-incident-support-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentSupport.uiSchema('781'),
        schema: incidentSupport.schema,
      },
      [`individualsInvolvedFollowUp${index}`]: {
        title: setReviewTitle(
          'PTSD incident individuals involved',
          index,
          formType,
        ),
        path: `disabilities/ptsd-individuals-involved-questions-${index}`,
        depends: isAddingIndividuals(index),
        uiSchema: individualsInvolvedFollowUp.uiSchema(index),
        schema: individualsInvolvedFollowUp.schema(index),
      },
      [`incidentDescription${index}`]: {
        title: setReviewTitle('PTSD Event Description', index, formType),
        path: `disabilities/ptsd-incident-description-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentDescription.uiSchema(index),
        schema: incidentDescription.schema(index),
      },
      // This should be the last page in the config loop
      [`ptsdAdditionalEvents${index}`]: {
        title: setReviewTitle(
          'PTSD incident Additional events.',
          index,
          formType,
        ),
        path: `disabilities/ptsd-additional-events-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: ptsdAdditionalEvents.uiSchema(index),
        schema: ptsdAdditionalEvents.schema(index),
      },
    };
  }

  return configObj;
}

export function createFormConfig781a(iterations) {
  let configObj = {};
  const formType = '781a';
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781a PAGE CONFIGS GO HERE
      [`secondaryIncidentDate${index}`]: {
        title: setReviewTitle('PTSD assault incident date', index, formType),
        path: `disabilities/ptsd-secondary-incident-date-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentDate.uiSchema(index),
        schema: secondaryIncidentDate.schema(index),
      },
      [`secondaryUploadSourcesChoice${index}`]: {
        title: `${
          numberToWords[index]
        } 781a PTSD Upload Supporting Sources Choice`,
        path: `disabilities/ptsd-secondary-upload-supporting-sources-choice-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryUploadSourcesChoice.uiSchema(index),
        schema: secondaryUploadSourcesChoice.schema(index),
      },
      [`secondaryUploadSources${index}`]: {
        title: `${numberToWords[index]} 781a PTSD Upload Supporting Sources`,
        path: `disabilities/ptsd-secondary-upload-supporting-sources-${index}`,
        depends: isUploading781aSupportingDocuments(index),
        uiSchema: secondaryUploadSources.uiSchema(index),
        schema: secondaryUploadSources.schema(index),
      },
      [`secondaryIncidentDescription${index}`]: {
        title: setReviewTitle(
          'PTSD assault event description',
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-incident-description-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentUnitAssignment.uiSchema(index),
        schema: secondaryIncidentUnitAssignment.schema(index),
      },
      [`secondaryIncidentSupport${index}`]: {
        title: setReviewTitle('PTSD assault incident support', index, formType),
        path: `disabilities/ptsd-secondary-incident-support-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: incidentSupport.uiSchema('781a'),
        schema: incidentSupport.schema,
      },
      [`secondaryIncidentUnitAssignment${index}`]: {
        title: setReviewTitle(
          'PTSD assualt incident unit assignment',
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-incident-unit-assignment-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentDescription.uiSchema(index),
        schema: secondaryIncidentDescription.schema(index),
      },
      [`secondaryOtherSources${index}`]: {
        title: `781a PTSD Other sources of information`,
        path: `disabilities/ptsd-secondary-other-sources-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryOtherSources.uiSchema(index),
        schema: secondaryOtherSources.schema(index),
      },
      [`secondaryOtherSourcesHelp${index}`]: {
        title: `781a PTSD Help with other sources of information`,
        path: `disabilities/ptsd-secondary-other-sources-help-${index}`,
        depends: wantsHelpWithOtherSourcesSecondary(index),
        uiSchema: secondaryOtherSourcesHelp.uiSchema(index),
        schema: secondaryOtherSourcesHelp.schema(index),
      },
      [`secondaryIncidentLocation${index}`]: {
        title: setReviewTitle(
          'PTSD assault incident location',
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-incident-location-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentLocation.uiSchema(index),
        schema: secondaryIncidentLocation.schema(index),
      },
      [`secondaryIncidentPermissionNotice${index}`]: {
        title: setReviewTitle(
          'PTSD assault permission notice',
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-permission-notice-${index}`,
        depends: wantsHelpWithPrivateRecordsSecondary(index),
        uiSchema: secondaryIncidentPermissionNotice.uiSchema,
        schema: secondaryIncidentPermissionNotice.schema,
      },
      [`secondaryIncidentAuthorities${index}`]: {
        title: setReviewTitle('PTSD assault authorities', index, formType),
        path: `disabilities/ptsd-secondary-authorities-${index}`,
        depends: wantsHelpRequestingStatementsSecondary(index),
        uiSchema: secondaryIncidentAuthorities.uiSchema(index),
        schema: secondaryIncidentAuthorities.schema(index),
      },
      // This should be the last page in the config loop
      [`ptsdSecondaryAdditionalEvents${index}`]: {
        title: setReviewTitle(
          'PTSD assault additional events',
          index,
          formType,
        ),
        path: `disabilities/ptsd-781a-additional-events-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: ptsdSecondaryAdditionalEvents.uiSchema(index),
        schema: ptsdSecondaryAdditionalEvents.schema(index),
      },
    };
  }
  return configObj;
}
