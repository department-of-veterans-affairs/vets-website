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
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';
import titleCase from 'platform/utilities/data/titleCase';

const REVIEW_TITLE_TOKEN = '[index]';

/**
 * This removes "First " from the title if there is only one incident.
 *
 * @param {string} [title] Displayed as the section summary header.
 * If contains REVIEW_TITLE_TOKEN and there is more than one incident, replaces
 *   REVIEW_TITLE_TOKEN with numberToWords(index).
 * If does not contain REVIEW_TITLE_TOKEN appends a capitalized
 *   numberToWords(index + 1) to front of title.
 * @param {int} index Index of numberToWords
 * @param {string} formType Indicates what type of form is calling function;
 *   781, 781a
 * @returns {object} title
 */
const setReviewTitle = (title, index, formType) => formData => {
  const additionalIncidentKeyIndex = index === 0 ? index : index - 1;
  const additionalIncidentKey = `view:enterAdditional${
    formType === '781a' ? 'Secondary' : ''
  }Events${additionalIncidentKeyIndex}`;

  let formattedTitle = title;

  if (formData[additionalIncidentKey]) {
    if (title.search(REVIEW_TITLE_TOKEN) > 0) {
      formattedTitle = title.replace(
        REVIEW_TITLE_TOKEN,
        ` ${numberToWords(index + 1)} `,
      );
    } else {
      // If does not contain REVIEW_TITLE_TOKEN put numberToWords(index + 1) at
      // start of title
      formattedTitle = `${numberToWords(index + 1)} ${title}`;
    }
  } else {
    // can do this without a search check
    formattedTitle = title.replace(REVIEW_TITLE_TOKEN, ' ');
  }

  return titleCase(formattedTitle || '');
};

export function createFormConfig781(iterations) {
  let configObj = {};
  const formType = '781';
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781 PAGE CONFIGS GO HERE
      // 3.  MEDALS OR  CITATIONS
      [`medals${index}`]: {
        title: setReviewTitle(
          `Medals or citations associated with${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-medals-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: medals.uiSchema(index),
        schema: medals.schema(index),
      },
      // 4. EVENT DATE
      [`incidentDate${index}`]: {
        title: setReviewTitle(`${REVIEW_TITLE_TOKEN}event`, index, formType),
        path: `disabilities/ptsd-incident-date-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentDate.uiSchema(index),
        schema: incidentDate.schema(index),
      },
      // 5. UNIT ASSIGNMENT
      [`incidentUnitAssignment${index}`]: {
        title: setReviewTitle(
          `Unit assignment for${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-incident-unit-assignment-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentUnitAssignment.uiSchema(index),
        schema: incidentUnitAssignment.schema(index),
      },
      // 6. EVENT LOCATION
      [`incidentLocation${index}`]: {
        title: setReviewTitle(
          `Location of${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-incident-location-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentLocation.uiSchema(index),
        schema: incidentLocation.schema(index),
      },
      // 7. INDIVIDUALS INVOLVED Y/N
      [`individualsInvolved${index}`]: {
        title: setReviewTitle(
          `Were other people involved in the${REVIEW_TITLE_TOKEN}event?`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-individuals-involved-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: individualsInvolved.uiSchema(index),
        schema: individualsInvolved.schema(index),
      },
      // 8. TAKE A BREAK
      [`incidentSupport${index}`]: {
        title: setReviewTitle('PTSD incident support', index, formType),
        path: `disabilities/ptsd-incident-support-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentSupport.uiSchema('781'),
        schema: incidentSupport.schema,
      },
      // 9. INDIVIDUALS INVOLVED DETAILS (if Yes for step 7)
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
      // 10. TAKE A BREAK
      [`incidentSupportAdditional${index}`]: {
        title: setReviewTitle(
          'PTSD incident support additional break',
          index,
          formType,
        ),
        path: `disabilities/ptsd-incident-support-additional-break-${index}`,
        depends: isAddingIndividuals(index),
        uiSchema: incidentSupport.uiSchema('781'),
        schema: incidentSupport.schema,
      },
      // 11. EVENT DESCRIPTION
      [`incidentDescription${index}`]: {
        title: setReviewTitle(
          `Description of${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-incident-description-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentDescription.uiSchema(index),
        schema: incidentDescription.schema(index),
      },
      // 12. ADDITIONAL EVENTS OR SITUATIONS Y/N
      // This should be the last page in the config loop
      [`ptsdAdditionalEvents${index}`]: {
        title: 'Add another event or situation?',
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
      // 3. Event Date
      [`secondaryIncidentDate${index}`]: {
        title: setReviewTitle(
          `Date of${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-incident-date-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentDate.uiSchema(index),
        schema: secondaryIncidentDate.schema(index),
      },
      // 4. Unit Assignment
      [`secondaryIncidentUnitAssignment${index}`]: {
        title: setReviewTitle(
          `Unit assignment for${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-incident-unit-assignment-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentUnitAssignment.uiSchema(index),
        schema: secondaryIncidentUnitAssignment.schema(index),
      },
      // 5. Event Location
      [`secondaryIncidentLocation${index}`]: {
        title: setReviewTitle(
          `Location of${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-incident-location-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentLocation.uiSchema(index),
        schema: secondaryIncidentLocation.schema(index),
      },
      // 6. Take a break
      [`secondaryIncidentSupport${index}`]: {
        title: setReviewTitle('PTSD assault incident support', index, formType),
        path: `disabilities/ptsd-secondary-incident-support-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: incidentSupport.uiSchema('781a'),
        schema: incidentSupport.schema,
      },
      // 7. Event Description
      [`secondaryIncidentDescription${index}`]: {
        title: setReviewTitle(
          `Description of${REVIEW_TITLE_TOKEN}event`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-incident-description-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentDescription.uiSchema(index),
        schema: secondaryIncidentDescription.schema(index),
      },
      // 8. OTHER SOURCES OF INFORMATION Y/N
      [`secondaryOtherSources${index}`]: {
        title: setReviewTitle(
          `781a PTSD Other sources of information`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-other-sources-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryOtherSources.uiSchema(index),
        schema: secondaryOtherSources.schema(index),
      },
      [`secondaryOtherSourcesHelp${index}`]: {
        title: setReviewTitle(
          `781a PTSD Help with other sources of information`,
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-other-sources-help-${index}`,
        depends: wantsHelpWithOtherSourcesSecondary(index),
        uiSchema: secondaryOtherSourcesHelp.uiSchema(index),
        schema: secondaryOtherSourcesHelp.schema(index),
      },
      // 8a. OTHER SOURCES OF INFORMATION: NEED HELP
      // If Yes, then PMR explanation page
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
      // 8b. OTHER SOURCES OF INFORMATION: REPORTS FROM AUTHORITIES
      [`secondaryIncidentAuthorities${index}`]: {
        title: 'Reports from authorities',
        path: `disabilities/ptsd-secondary-authorities-${index}`,
        depends: wantsHelpRequestingStatementsSecondary(index),
        uiSchema: secondaryIncidentAuthorities.uiSchema(index),
        schema: secondaryIncidentAuthorities.schema(index),
      },
      // 9. SUPPORTING DOCUMENTS UPLOAD
      [`secondaryUploadSourcesChoice${index}`]: {
        title: `${titleCase(
          numberToWords(index + 1),
        )} 781a PTSD Upload Supporting Sources Choice`,
        path: `disabilities/ptsd-secondary-upload-supporting-sources-choice-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryUploadSourcesChoice.uiSchema(index),
        schema: secondaryUploadSourcesChoice.schema(index),
      },
      [`secondaryUploadSources${index}`]: {
        title: setReviewTitle(
          '781a PTSD Upload Supporting Sources',
          index,
          formType,
        ),
        path: `disabilities/ptsd-secondary-upload-supporting-sources-${index}`,
        depends: isUploading781aSupportingDocuments(index),
        uiSchema: secondaryUploadSources.uiSchema(index),
        schema: secondaryUploadSources.schema(index),
      },
      // 10. ADDITIONAL EVENTS OR SITUATIONS Y/N
      // This should be the last page in the config loop
      [`ptsdSecondaryAdditionalEvents${index}`]: {
        title: 'Add another event or situation?',
        path: `disabilities/ptsd-781a-additional-events-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: ptsdSecondaryAdditionalEvents.uiSchema(index),
        schema: ptsdSecondaryAdditionalEvents.schema(index),
      },
    };
  }
  return configObj;
}
