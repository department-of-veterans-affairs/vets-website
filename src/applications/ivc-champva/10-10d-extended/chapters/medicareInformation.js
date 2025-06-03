import React from 'react';
import { memoize } from 'lodash';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  titleUI,
  titleSchema,
  radioUI,
  radioSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  toHash,
  applicantWording,
  getAgeInYears,
} from '../../shared/utilities';

import {
  selectMedicareParticipantPage,
  SelectMedicareParticipantPage,
} from './SelectMedicareParticipantsPage';

const MEDICARE_TYPE_LABELS = {
  ab: 'Original Medicare Parts A and B (hospital and medical coverage)',
  c:
    'Medicare Part C Advantage Plan (this option includes being previously enrolled in Part A and B )',
  a: 'Medicare Part A only (hospital coverage)',
  b: 'Medicare Part B only (medical coverage)',
};

const medicareYesNoHint =
  'If any applicants have Medicare, you’re required to report it to process your application for CHAMPVA benefits. ';

// Memoizing the `toHash` helper func since it'll be getting hammered
// a lot in the `depends` checks.
const toHashMemoized = memoize(str => toHash(str));

// Get the name of the applicant selected on the Medicare participant page
export function generateParticipantName(item) {
  if (item) {
    const applicantObjects = item['view:applicantObjects'] || [];
    const match = applicantObjects.find(
      app => item?.medicareParticipant === toHashMemoized(app.applicantSSN),
    );
    const name = applicantWording(match, false, false, false);
    return name.length > 0 ? name : 'No member specified';
  }
  return 'No participant';
}

const medicareOptions = {
  arrayPath: 'medicare',
  nounSingular: 'plan',
  nounPlural: 'plans',
  required: false,
  // TODO: add proper checks
  isItemIncomplete: () => false,
  text: {
    getItemName: item => generateParticipantName(item),
    cardDescription: item => (
      <ul className="no-bullets">
        <li>
          <b>Type:</b> {MEDICARE_TYPE_LABELS[(item?.medicarePlanType)]}
        </li>
      </ul>
    ),
  },
};

const medicareSummaryPage = {
  uiSchema: {
    ...titleUI('Report Medicare'),
    'view:hasMedicare': arrayBuilderYesNoUI(
      medicareOptions,
      {
        title:
          'Do you have any Medicare to report for one or more applicants? ',
        hint: medicareYesNoHint,
      },
      {
        title: 'Do you have another plan to report for one or more applicants?',
        hint: medicareYesNoHint,
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'view:hasMedicare': arrayBuilderYesNoSchema,
    },
    required: ['view:hasMedicare'],
  },
};

// IF USER SPECIFIES AN APPLICANT WHO IS >= 65
const medicarePlanOver65 = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare plan types`,
    ),
    medicarePlanType: {
      ...radioUI({
        title:
          'Which of the following Medicare plans does this beneficiary have?',
        required: () => true,
        labels: {
          ab: 'Original Medicare Parts A and B (hospital and medical coverage)',
          c:
            'Medicare Part C Advantage Plan (this option includes being previously enrolled in Part A and B )',
          a: 'Medicare Part A only (hospital coverage)',
          b: 'Medicare Part B only (medical coverage)',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePlanType'],
    properties: {
      titleSchema,
      medicarePlanType: radioSchema(['ab', 'c', 'a', 'b']),
    },
  },
};

// IF USER SPECIFIES AN APPLICANT WHO IS < 65
const medicarePlanUnder65 = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare plan types`,
    ),
    medicarePlanType: {
      ...radioUI({
        title:
          'Which of the following Medicare plans does this beneficiary have?',
        required: () => true,
        labels: {
          ab: 'Original Medicare Parts A and B (hospital and medical coverage)',
          c:
            'Medicare Part C Advantage Plan (this option includes being previously enrolled in Part A and B )',
          a: 'Medicare Part A only (hospital coverage)',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePlanType'],
    properties: {
      titleSchema,
      medicarePlanType: radioSchema(['ab', 'c', 'a']),
    },
  },
};

// PAGES NEEDED:
// IF USER SPECIFIES ONLY A/B:
//   - medicare parts a/b effective dates
//   - medicare parts a/b card upload
// IF USER SPECIFIES ONLY A:
//   - medicare parts a effective date
//   - medicare parts a card upload
// IF USER SPECIFIES ONLY B:
//   - medicare parts b effective date
//   - medicare parts b card upload
//   - Medicare status (ask if denied 'A')
//     - Disallowance of A upload
// IF USER SPECIFIES PART C:
//   - medicare parts a/b effective dates (includes part C explanatory dropdown)
//   - medicare parts a/b card upload
//   - medicare part C carrier and effective date
//   - pharmacy benefits yes/no
//   - medicare parts c card upload
// IF USER SELECTED (A & B) OR D
//   - Do you have medicare part D info to add? yes/no
//   - medicare part D carrier and effective date
//   - medicare parts D card upload
// - Summary page
// - generic disallowance yes/no + upload screen (TBD, need Jamie's design)

export const medicarePages = arrayBuilderPages(
  medicareOptions,
  pageBuilder => ({
    medicareIntro: pageBuilder.introPage({
      path: 'medicare-intro',
      title: '[noun plural]',
      uiSchema: {
        ...titleUI('Medicare intro page (delete?)', <>Medicare intro page.</>),
      },
      schema: {
        type: 'object',
        properties: {
          titleSchema,
        },
      },
    }),
    medicareSummary: pageBuilder.summaryPage({
      path: 'medicare-summary',
      title: 'Review your Medicare plans',
      uiSchema: medicareSummaryPage.uiSchema,
      schema: medicareSummaryPage.schema,
    }),
    participant: pageBuilder.itemPage({
      path: 'select-participant/:index',
      title: 'Select Medicare participants',
      ...selectMedicareParticipantPage,
      CustomPage: props =>
        SelectMedicareParticipantPage({
          ...props,
          // resolve prop warning that the index is a string rather than a number:
          pagePerItemIndex: +props.pagePerItemIndex,
        }),
      CustomPageReview: () => <></>,
    }),
    medicareTypeOver65: pageBuilder.itemPage({
      path: 'medicare-type-over-65/:index',
      title: 'Plan type (over 65)',
      depends: (formData, index) => {
        const curAppHash = formData?.medicare?.[index]?.medicareParticipant;
        const curApp = formData?.applicants?.find(
          a => toHashMemoized(a.applicantSSN) === curAppHash,
        );
        const age = getAgeInYears(curApp?.applicantDob);
        return age >= 65;
      },
      ...medicarePlanOver65,
    }),
    medicareTypeUnder65: pageBuilder.itemPage({
      path: 'medicare-type-under-65/:index',
      title: 'Plan type (over 65)',
      depends: (formData, index) => {
        const curAppHash = formData?.medicare?.[index]?.medicareParticipant;
        const curApp = formData?.applicants?.find(
          a => toHashMemoized(a.applicantSSN) === curAppHash,
        );
        const age = getAgeInYears(curApp?.applicantDob);
        return age < 65;
      },
      ...medicarePlanUnder65,
    }),
  }),
);
