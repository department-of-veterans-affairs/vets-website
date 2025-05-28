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
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import medicarePartAPartBFrontImage from '../assets/images/medicare_pt_a_pt_b_front.png';
import medicarePartAPartBBackImage from '../assets/images/medicare_pt_a_pt_b_back.png';
import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import { createCardUploadSchema } from '../../shared/components/fileUploads/genericCardUpload';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
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
    return name.length > 0 ? name : 'applicant';
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

// Medicare effective dates page definition
const medicarePartAPartBEffectiveDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare effective dates`,
    ),
    'view:partATitle': {
      'ui:description': <h3>Medicare Part A</h3>,
    },
    medicarePartAEffectiveDate: currentOrPastDateUI({
      title: 'Effective date',
      hint:
        'You may find your effective date on the front of your Medicare card near "Coverage starts" or "Effective date."',
      required: () => true,
    }),
    'view:partBTitle': {
      'ui:description': <h3>Medicare Part A</h3>,
    },
    medicarePartBEffectiveDate: currentOrPastDateUI({
      title: 'Effective date',
      hint:
        'You may find your effective date on the front of your Medicare card near "Coverage starts" or "Effective date."',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'view:partATitle': blankSchema,
      medicarePartAEffectiveDate: currentOrPastDateSchema,
      'view:partBTitle': blankSchema,
      medicarePartBEffectiveDate: currentOrPastDateSchema,
    },
  },
};

// IF USER SPECIFIES ONLY A/B:
// Create custom description component for Medicare card
const medicarePartAPartBDescription = (
  <div>
    <p>
      You’ll need to submit a copy of your Original Medicare Health Card,
      sometimes referred to as the "red, white, and blue" Medicare card.
    </p>
    <p>This card shows:</p>
    <ul>
      <li>
        You have Medicare Part A (listed as HOSPITAL), <strong>and</strong>
      </li>
      <li>
        You have Medicare Part B (listed as MEDICAL), <strong>and</strong>
      </li>
      <li>The date your coverage begins</li>
    </ul>
  </div>
);

// Use the generic card upload schema
const {
  uiSchema: medicareCardUiSchema,
  schema: medicareCardSchema,
} = createCardUploadSchema({
  customDescription: medicarePartAPartBDescription,
  frontProperty: 'medicarePartAPartBFrontCard',
  backProperty: 'medicarePartAPartBBackCard',
  frontImageSrc: medicarePartAPartBFrontImage,
  backImageSrc: medicarePartAPartBBackImage,
  frontAltText:
    'Red, white, and blue Medicare card. It states "Medicare Health Insurance" and lists the Medicare number and coverage dates for Part A hospital and Part B medical coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Original Medicare card',
  frontLabel: 'Upload front of original Medicare card',
  backLabel: 'Upload back of original Medicare card',
});

// Define the Medicare A/B card upload page using the generic schema
const medicareABCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare card for hospital and medical coverage',
    ),
    ...medicareCardUiSchema,
  },
  schema: medicareCardSchema,
};

// IF USER SPECIFIES ONLY A:
// Medicare Part A effective date page definition
const medicarePartAEffectiveDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare Part A effective date`,
    ),
    medicarePartAEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part A effective date',
      hint:
        'You may find your effective date on the front of your Medicare card near "Coverage starts" or "Effective date."',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartAEffectiveDate'],
    properties: {
      titleSchema,
      medicarePartAEffectiveDate: currentOrPastDateSchema,
    },
  },
};

// Create custom description component for Medicare Part A card
const medicarePartADescription = (
  <div>
    <p>
      You’ll need to submit a copy of your Original Medicare Health Part A Card,
      sometimes referred to as the "red, white, and blue" Medicare card.
    </p>
    {fileUploadBlurb['view:fileUploadBlurb']['ui:description']}
  </div>
);

// Use the generic card upload schema for Medicare Part A
const {
  uiSchema: medicarePartACardUiSchema,
  schema: medicarePartACardSchema,
} = createCardUploadSchema({
  customDescription: medicarePartADescription,
  showFilesBlurb: false,
  frontProperty: 'medicarePartAFrontCard',
  backProperty: 'medicarePartABackCard',
  frontImageSrc: medicarePartAPartBFrontImage,
  backImageSrc: medicarePartAPartBBackImage,
  frontAltText:
    'Red, white, and blue Medicare card. It states "Medicare Health Insurance" and lists the Medicare number and coverage dates for Part A hospital coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Medicare Part A card',
  frontLabel: 'Upload front of Part A Medicare card',
  backLabel: 'Upload back of Part A Medicare card',
});

// Define the Medicare Part A card upload page using the generic schema
const medicarePartACardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Upload Medicare Part A card'),
    ...medicarePartACardUiSchema,
  },
  schema: medicarePartACardSchema,
};

// IF USER SPECIFIES ONLY B:
// Medicare Part B effective date page definition
const medicarePartBEffectiveDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare Part B effective date`,
    ),
    medicarePartBEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part B effective date',
      hint:
        'You may find your effective date on the front of your Medicare card near "Coverage starts" or "Effective date."',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartBEffectiveDate'],
    properties: {
      titleSchema,
      medicarePartBEffectiveDate: currentOrPastDateSchema,
    },
  },
};

// Create custom description component for Medicare Part B card
const medicarePartBDescription = (
  <div>
    <p>
      You’ll need to submit a copy of your Original Medicare Health Part B Card,
      sometimes referred to as the "red, white, and blue" Medicare card.
    </p>
    {fileUploadBlurb['view:fileUploadBlurb']['ui:description']}
  </div>
);

// Use the generic card upload schema for Medicare Part B
const {
  uiSchema: medicarePartBCardUiSchema,
  schema: medicarePartBCardSchema,
} = createCardUploadSchema({
  customDescription: medicarePartBDescription,
  showFilesBlurb: false,
  frontProperty: 'medicarePartBFrontCard',
  backProperty: 'medicarePartBBackCard',
  frontImageSrc: medicarePartAPartBFrontImage,
  backImageSrc: medicarePartAPartBBackImage,
  frontAltText:
    'Red, white, and blue Medicare card. It states "Medicare Health Insurance" and lists the Medicare number and coverage dates for Part B medical coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Medicare Part B card',
  frontLabel: 'Upload front of Part B Medicare card',
  backLabel: 'Upload back of Part B Medicare card',
});

// Define the Medicare Part B card upload page using the generic schema
const medicarePartBCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Upload Medicare Part B card'),
    ...medicarePartBCardUiSchema,
  },
  schema: medicarePartBCardSchema,
};

// Define the Medicare Part A denial page
const medicarePartADenialPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `${generateParticipantName(formData)} Medicare status`,
      <va-alert
        status="info"
        class="vads-u-margin-bottom--3"
        uswds
        background-color="true"
      >
        <p>
          Applicants that don’t have Medicare Part A and B or proof of
          ineligibility may not be eligible for CHAMPVA.
        </p>
      </va-alert>,
    ),
    hasPartADenial: {
      ...radioUI({
        title:
          'Do you have a notice of disallowance, denial, or other proof of ineligibility for Medicare Part A?',
        hint:
          'Depending on your response, you may need to submit additional documents with this application.',
        required: () => true,
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['hasPartADenial'],
    properties: {
      titleSchema,
      hasPartADenial: radioSchema(['Y', 'N']),
    },
  },
};

const medicarePartADenialProofUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload proof of Medicare ineligibility',
      ({ formData }) => {
        return (
          <>
            {generateParticipantName(formData)} is 65 years or older and you
            selected that they do not have Medicare Part A.
            <br />
            <br />
            You’ll need to submit a copy of a letter from the Social Security
            Administration that confirms that they don’t qualify for Medicare
            benefits under anyone’s Social Security number.
          </>
        );
      },
    ),
    ...fileUploadBlurb,
    medicarePartADenialProof: fileUploadUI({
      label: 'Upload proof of Medicare ineligibility',
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartADenialProof'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      medicarePartADenialProof: {
        type: 'array',
        maxItems: 1,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

// PAGES NEEDED:
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
    medicarePartAEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-a-effective-date/:index',
      title: 'Medicare Part A effective date',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'a';
      },
      ...medicarePartAEffectiveDatePage,
    }),
    medicarePartACardUpload: pageBuilder.itemPage({
      path: 'medicare-part-a-card-upload/:index',
      title: 'Upload Medicare Part A card',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'a';
      },
      CustomPage: FileFieldCustom,
      ...medicarePartACardUploadPage,
    }),
    medicarePartBEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-b-effective-date/:index',
      title: 'Medicare Part B effective date',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'b';
      },
      ...medicarePartBEffectiveDatePage,
    }),
    medicarePartBCardUpload: pageBuilder.itemPage({
      path: 'medicare-part-b-card-upload/:index',
      title: 'Upload Medicare Part B card',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'b';
      },
      CustomPage: FileFieldCustom,
      ...medicarePartBCardUploadPage,
    }),
    medicarePartADenial: pageBuilder.itemPage({
      path: 'medicare-part-a-denial/:index',
      title: 'Medicare Part A denial',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'b';
      },
      ...medicarePartADenialPage,
    }),
    medicarePartADenialProofUpload: pageBuilder.itemPage({
      path: 'medicare-part-a-denial-upload/:index',
      title: 'Upload proof of Medicare ineligibility',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        const hasProof = formData?.medicare?.[index]?.hasPartADenial;
        const curAppHash = formData?.medicare?.[index]?.medicareParticipant;

        const curApp = formData?.applicants?.find(
          a => toHashMemoized(a.applicantSSN) === curAppHash,
        );
        const over65 = getAgeInYears(curApp?.applicantDob) >= 65;

        return planType === 'b' && hasProof === 'Y' && over65;
      },
      CustomPage: FileFieldCustom,
      ...medicarePartADenialProofUploadPage,
    }),
    medicarePartAPartBEffectiveDates: pageBuilder.itemPage({
      path: 'medicare-effective-dates/:index',
      title: 'Medicare effective dates',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'ab';
      },
      ...medicarePartAPartBEffectiveDatesPage,
    }),
    medicareABCardUpload: pageBuilder.itemPage({
      path: 'medicare-ab-card-upload/:index',
      title: 'Upload Medicare card (A/B)',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'ab';
      },
      CustomPage: FileFieldCustom,
      ...medicareABCardUploadPage,
    }),
  }),
);
