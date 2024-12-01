import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantWording } from '../../shared/utilities';
import { applicantListSchema } from '../helpers/utilities';
import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';

const KEYNAME = 'applicantSponsorMarriageDetails';

/* 
Being generous with the applicantRelationshipPage component and
using it to create this radio interface w custom wording.

This page is displayed when the sponsor is deceased and the
applicant indicated they were married to the sponsor at some point.
*/
function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });

  const customTitle = `${bp.applicant}’s marriage to the ${bp.personTitle}`;

  const description = `Which of these best describes ${
    bp.applicant
  }’s marriage to their ${bp.personTitle}?`;

  const options = [
    {
      label: `${bp.relative} was married to the ${
        bp.personTitle
      } at the time of their death and didn’t remarry`,
      value: 'marriedTillDeathNoRemarriage',
    },
    {
      label: `${bp.relative} was legally separated from ${
        bp.personTitle
      } before their death`,
      value: 'marriageDissolved',
    },
    {
      label: `${bp.relative} was married to the ${
        bp.personTitle
      } at the time of their death and remarried someone else on or after ${
        bp.relativePossessive
      } 55th birthday`,
      value: 'marriedTillDeathRemarriedAfter55',
    },
    {
      label: `Other relationship`,
      value: `other`,
    },
  ];

  return {
    options,
    ...bp,
    keyname: KEYNAME,
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

// IF applicant was married to sponsor AND did not remarry after the sponsor's
// death (or is still married to the living sponsor)
export function depends18f3(formData, index) {
  if (index === undefined) return true;
  return (
    get(
      'applicantRelationshipToSponsor.relationshipToVeteran',
      formData?.applicants?.[index],
    ) === 'spouse'
  );
}

function marriageTitle(text, subtitle) {
  return {
    viewField: ApplicantField,
    updateSchema: _formData => {
      return {
        title: ({ formData }) => {
          return titleUI(
            `${applicantWording(formData, true, true)} ${text}`,
            subtitle,
          )['ui:title'];
        },
      };
    },
  };
}

const dateOfMarriageToSponsor = {
  ...currentOrPastDateUI({
    title: 'Date of marriage to sponsor',
    errorMessages: {
      pattern: 'Please provide a valid date',
      required: 'Please provide the date of marriage',
    },
  }),
  /* Using the depends functions to prevent silent validation failures
          on the review page */
  'ui:required': (formData, index) => depends18f3(formData, index),
};

/*
Dates for marriage/remarriage - we use this uiSchema across multiple pages, and
control the visibility/required state of individual fields by using different 
schemas and `depends` functions. Tried using updateSchema to facilitate this 
but was still getting silent validation failures on review page.
*/
export const marriageDatesSchema = {
  noRemarriageUiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        'ui:options': marriageTitle(
          ' date of marriage to sponsor',
          'If you don’t know the exact date, enter your best guess',
        ),
        dateOfMarriageToSponsor,
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
