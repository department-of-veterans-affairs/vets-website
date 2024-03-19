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

// Dates for marriage/remarriage
export const marriageDatesSchema = {
  uiSchema: {
    applicants: {
      items: {
        'ui:options': { viewField: ApplicantField },
        ...titleUI('Applicant date of marriage to sponsor'),
        dateOfMarriageToSponsor: currentOrPastDateUI({
          title: 'Date of marriage',
          errorMessages: {
            pattern: 'Please provide a valid date',
            required: 'Please provide the date of marriage',
          },
        }),
        dateOfSeparationFromSponsor: currentOrPastDateUI({
          title: 'Date of legal separation of the marriage',
          errorMessages: {
            pattern: 'Please provide a valid date',
            required: 'Please provide the date of separation',
          },
        }),
        dateOfMarriageToOtherSpouse: currentOrPastDateUI({
          title: 'Date of remarriage',
          errorMessages: {
            pattern: 'Please provide a valid date',
            required: 'Please provide the date of remarriage',
          },
        }),
        dateOfSeparationFromOtherSpouse: currentOrPastDateUI({
          title: 'Date of legal separation of the remarriage',
          errorMessages: {
            pattern: 'Please provide a valid date',
            required: 'Please provide the date of separation',
          },
        }),
      },
    },
  },
  noRemarriageSchema: applicantListSchema(['dateOfMarriageToSponsor'], {
    titleSchema,
    dateOfMarriageToSponsor: currentOrPastDateSchema,
  }),
  separatedSchema: applicantListSchema(
    ['dateOfMarriageToSponsor', 'dateOfSeparationFromSponsor'],
    {
      titleSchema,
      dateOfMarriageToSponsor: currentOrPastDateSchema,
      dateOfSeparationFromSponsor: currentOrPastDateSchema,
    },
  ),
  remarriageSchema: applicantListSchema(
    ['dateOfMarriageToSponsor', 'dateOfMarriageToOtherSpouse'],
    {
      titleSchema,
      dateOfMarriageToSponsor: currentOrPastDateSchema,
      dateOfMarriageToOtherSpouse: currentOrPastDateSchema,
    },
  ),
  remarriageSeparatedSchema: applicantListSchema(
    [
      'dateOfMarriageToSponsor',
      'dateOfMarriageToOtherSpouse',
      'dateOfSeparationFromOtherSpouse',
    ],
    {
      titleSchema,
      dateOfMarriageToSponsor: currentOrPastDateSchema,
      dateOfMarriageToOtherSpouse: currentOrPastDateSchema,
      dateOfSeparationFromOtherSpouse: currentOrPastDateSchema,
    },
  ),
};

// Schemas for follow-up marriage questions
export const remarriageDetailsSchema = {
  uiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        ...titleUI('Applicant remarriage status'),
        remarriageIsViable: yesNoUI({
          title: 'Is the remarriage still viable?',
          hint: additionalFilesHint,
          labels: {
            Y: 'Yes, second marriage is viable',
            N: 'No, second marriage has legally ended',
          },
        }),
      },
    },
  },
  schema: applicantListSchema(['remarriageIsViable'], {
    titleSchema,
    remarriageIsViable: yesNoSchema,
  }),
};
