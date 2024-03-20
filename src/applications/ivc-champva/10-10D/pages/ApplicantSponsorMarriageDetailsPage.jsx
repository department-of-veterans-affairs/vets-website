import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  titleSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { additionalFilesHint } from '../helpers/wordingCustomization';
import { applicantListSchema } from '../helpers/utilities';
import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from './ApplicantRelationshipPage';
import ApplicantField from '../components/Applicant/ApplicantField';

const KEYNAME = 'applicantSponsorMarriageDetails';

/* 
Being generous with the applicantRelationshipPage component and
using it to create this radio interface w custom wording.

This page is displayed when the sponsor is deceased and the
applicant indicated they were married to the sponsor at some point.
*/
function generateOptions({ data, pagePerItemIndex }) {
  const {
    currentListItem,
    personTitle,
    applicant,
    useFirstPerson,
    relative,
    relativePossessive,
  } = appRelBoilerplate({ data, pagePerItemIndex });

  const customTitle = `${
    useFirstPerson ? `Your` : `${applicant}’s`
  } marriage to the ${personTitle}`;

  const description = `What was ${
    useFirstPerson ? `your` : `${applicant}’s`
  } marriage status to the ${personTitle}?`;

  const options = [
    {
      label: `${relative} was married to the ${personTitle} at the time of their death and did not remarry`,
      value: 'marriedTillDeathNoRemarriage',
    },
    {
      label: `${relative} was married to the ${personTitle} at the time of ${personTitle}’s death and remarried someone else on or after ${
        useFirstPerson ? 'my' : relativePossessive
      } 55th birthday`,
      value: 'marriedTillDeathRemarriedAfter55',
    },
    {
      label: `${relative} was legally separated from ${personTitle} before ${personTitle} died`,
      value: 'marriageDissolved',
    },
    {
      label: `${
        applicant && !useFirstPerson ? `${applicant}` : 'My'
      } relationship is not listed here`,
      value: 'other',
    },
  ];

  return {
    options,
    useFirstPerson,
    relativePossessive,
    applicant,
    personTitle,
    keyname: KEYNAME,
    currentListItem,
    customTitle,
    description,
  };
}

export function ApplicantSponsorMarriageDetailsPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantSponsorMarriageDetailsReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

/*
The following `depends` functions are used to control all the various marriage/
separation pages, as well as update the required status of fields that show up 
on more than one of those pages. The func names correspond to their page of 
origin.
*/

// IF applicant was married to sponsor AND remarried after sponsor passed
// AND applicant was 55+
export function depends18f2(formData, index) {
  if (index === undefined) return true;
  return (
    get(
      'applicantRelationshipToSponsor.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'spouse' &&
    (get('sponsorIsDeceased', formData) &&
      get(
        'applicantSponsorMarriageDetails.relationshipToVeteran',
        formData?.applicants?.[index],
      ) === 'marriedTillDeathRemarriedAfter55')
  );
}

// IF applicant was married to sponsor AND did not remarry after the sponsor's
// death (or is still married to the living sponsor)
export function depends18f3(formData, index) {
  if (index === undefined) return true;
  return (
    get(
      'applicantRelationshipToSponsor.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'spouse' &&
    (get(
      'applicantSponsorMarriageDetails.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'marriedTillDeathNoRemarriage' ||
      !get('sponsorIsDeceased', formData))
  );
}

// IF applicant was married to sponsor AND remarried after sponsor passed
// AND remarriage is still ongoing
export function depends18f4(formData, index) {
  if (index === undefined) return true;
  return (
    get(
      'applicantRelationshipToSponsor.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'spouse' &&
    get(
      'applicantSponsorMarriageDetails.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'marriedTillDeathRemarriedAfter55' &&
    get('remarriageIsViable', formData?.applicants?.[index])
  );
}

// IF applicant was married to sponsor AND remarried after sponsor passed
// AND remarriage has been dissolved
export function depends18f5(formData, index) {
  if (index === undefined) return true;
  return (
    get(
      'applicantRelationshipToSponsor.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'spouse' &&
    get(
      'applicantSponsorMarriageDetails.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'marriedTillDeathRemarriedAfter55' &&
    !get('remarriageIsViable', formData?.applicants?.[index])
  );
}

// IF applicant was married to sponsor AND separated prior to sponsor death
export function depends18f6(formData, index) {
  if (index === undefined) return true;
  return (
    get(
      'applicantRelationshipToSponsor.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'spouse' &&
    get(
      'applicantSponsorMarriageDetails.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'marriageDissolved'
  );
}

/*
Dates for marriage/remarriage - we use this uiSchema across multiple pages, and
control the visibility/required state of individual fields by using different 
schemas and `depends` functions. Tried using updateSchema to facilitate this 
but was still getting silent validation failures on review page.
*/
export const marriageDatesSchema = {
  uiSchema: {
    applicants: {
      items: {
        'ui:options': { viewField: ApplicantField },
        ...titleUI('Applicant date of marriage to sponsor'),
        dateOfMarriageToSponsor: {
          ...currentOrPastDateUI({
            title: 'Date of marriage',
            errorMessages: {
              pattern: 'Please provide a valid date',
              required: 'Please provide the date of marriage',
            },
          }),
          /* Using the depends functions to prevent silent validation failures
          on the review page */
          'ui:required': (formData, index) =>
            depends18f3(formData, index) ||
            depends18f4(formData, index) ||
            depends18f5(formData, index) ||
            depends18f6(formData, index),
        },
        dateOfSeparationFromSponsor: {
          ...currentOrPastDateUI({
            title: 'Date of legal separation of the marriage',
            errorMessages: {
              pattern: 'Please provide a valid date',
              required: 'Please provide the date of separation',
            },
          }),
          'ui:required': (formData, index) => depends18f6(formData, index),
        },
        dateOfMarriageToOtherSpouse: {
          ...currentOrPastDateUI({
            title: 'Date of remarriage',
            errorMessages: {
              pattern: 'Please provide a valid date',
              required: 'Please provide the date of remarriage',
            },
          }),
          'ui:required': (formData, index) =>
            depends18f4(formData, index) || depends18f2(formData, index),
        },
        dateOfSeparationFromOtherSpouse: {
          ...currentOrPastDateUI({
            title: 'Date of legal separation of the remarriage',
            errorMessages: {
              pattern: 'Please provide a valid date',
              required: 'Please provide the date of separation',
            },
          }),
          'ui:required': (formData, index) => depends18f5(formData, index),
        },
      },
    },
  },
  noRemarriageSchema: applicantListSchema([], {
    titleSchema,
    dateOfMarriageToSponsor: currentOrPastDateSchema,
  }),
  separatedSchema: applicantListSchema([], {
    titleSchema,
    dateOfMarriageToSponsor: currentOrPastDateSchema,
    dateOfSeparationFromSponsor: currentOrPastDateSchema,
  }),
  remarriageSchema: applicantListSchema([], {
    titleSchema,
    dateOfMarriageToSponsor: currentOrPastDateSchema,
    dateOfMarriageToOtherSpouse: currentOrPastDateSchema,
  }),
  remarriageSeparatedSchema: applicantListSchema([], {
    titleSchema,
    dateOfMarriageToSponsor: currentOrPastDateSchema,
    dateOfMarriageToOtherSpouse: currentOrPastDateSchema,
    dateOfSeparationFromOtherSpouse: currentOrPastDateSchema,
  }),
};

// Schemas for follow-up marriage viability question
export const remarriageDetailsSchema = {
  uiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        ...titleUI('Applicant remarriage status'),
        remarriageIsViable: {
          ...yesNoUI({
            title: 'Is the remarriage still viable?',
            hint: additionalFilesHint,
            labels: {
              Y: 'Yes, second marriage is viable',
              N: 'No, second marriage has legally ended',
            },
          }),
          'ui:required': (formData, index) => depends18f2(formData, index),
        },
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    remarriageIsViable: yesNoSchema,
  }),
};
