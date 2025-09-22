/* eslint-disable no-unused-vars */
import React from 'react';
import { memoize } from 'lodash';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  titleUI,
  textUI,
  textSchema,
  radioUI,
  yesNoUI,
  yesNoSchema,
  radioSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import { createCardUploadSchema } from '../../shared/components/fileUploads/genericCardUpload';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import {
  toHash,
  applicantWording,
  getAgeInYears,
} from '../../shared/utilities';
import { ADDITIONAL_FILES_HINT } from '../../shared/constants';
import { validateMedicarePartDDates } from '../helpers/validations';

import {
  selectMedicareParticipantPage,
  SelectMedicareParticipantPage,
} from './SelectMedicareParticipantsPage';

const MEDICARE_TYPE_LABELS = {
  ab: 'Original Medicare Parts A and B (hospital and medical coverage)',
  c:
    'Medicare Part C Advantage Plan (this option includes being previously enrolled in Part A and B)',
  a: 'Medicare Part A only (hospital coverage)',
  b: 'Medicare Part B only (medical coverage)',
};

// Memoizing the `toHash` helper func since it'll be getting called
// a lot in the `depends` checks.
const toHashMemoized = memoize(str => toHash(str));

/**
 * Options for the yes/no text on summary page:
 */
const yesNoOptions = {
  title: 'Do any applicants have medicare plans?',
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '5',
  hint:
    'If so, you must report this information for us to process your application for CHAMPVA benefits.',
};
const yesNoOptionsMore = {
  title: 'Report Medicare',
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '5',
  hint:
    'Do any applicants have medicare plans? If so, you must report this information for us to process your application for CHAMPVA benefits.',
};

// Get the name of the applicant selected on the Medicare participant page
export function generateParticipantName(item) {
  if (item) {
    const applicantObjects = item['view:applicantObjects'] || [];
    const match = applicantObjects.find(
      app => item?.medicareParticipant === toHashMemoized(app.applicantSSN),
    );
    const name = applicantWording(match, false, false, false);
    return name.length > 0 ? `${name}'s` : 'applicant';
  }
  return 'No participant';
}

export const medicareOptions = {
  arrayPath: 'medicare',
  nounSingular: 'plan',
  nounPlural: 'plans',
  required: false,
  // TODO: add proper checks
  isItemIncomplete: () => false,
  maxItems: formData => formData?.applicants?.length,
  text: {
    getItemName: item => generateParticipantName(item),
    cardDescription: item => (
      <ul className="no-bullets">
        <li>
          <b>Type:</b> {MEDICARE_TYPE_LABELS[(item?.medicarePlanType)]}
          {item?.hasMedicarePartD
            ? ', Medicare Part D (prescription drug coverage)'
            : null}
        </li>
      </ul>
    ),
  },
};

const medicareSummaryPage = {
  uiSchema: {
    ...titleUI('Report Medicare', 'Do any applicants have medicare?'),
    'view:hasMedicare': arrayBuilderYesNoUI(
      medicareOptions,
      yesNoOptions,
      yesNoOptionsMore,
    ),
  },
  schema: {
    type: 'object',
    properties: {
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
        title: 'Which medicare plan does this beneficiary have?',
        required: () => true,
        labels: {
          ab:
            'Original Medicare Parts A and B (Hospital and Medical Insurance)',
          c:
            'Update to Medicare Part C, also known as Medicare Advantage (includes previous enrollment in Part A and B )',
          a: 'Medicare Part A only (Hospital Insurance)',
          b: 'Medicare Part B only (Medical Insurance)',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePlanType'],
    properties: {
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
          ab:
            'Original Medicare Parts A and B (Hospital and Medical Insurance)',
          c:
            'Medicare Part C, also known as Medicare Advantage (includes previous enrollment in Part A and B )',
          a: 'Medicare Part A only (Hospital Insurance)',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePlanType'],
    properties: {
      medicarePlanType: radioSchema(['ab', 'c', 'a']),
    },
  },
};

// Medicare effective dates page definition
// This is used for Parts A&B as well as Part C.
const medicarePartAPartBEffectiveDatesPage = partC => {
  const uiProperties = {};
  const schemaProperties = {};
  if (partC) {
    uiProperties['view:partCExplanation'] = {
      'ui:description': (
        <va-additional-info
          trigger="
          Why do we need Parts A and B information if you have a Part C plan?"
          class="vads-u-margin-bottom--4"
        >
          <p className="vads-u-margin-y--0">
            We need to confirm the dates you first became eligible for Parts A
            and B.
          </p>
        </va-additional-info>
      ),
    };

    schemaProperties['view:partCExplanation'] = blankSchema;
  }
  return {
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          `${generateParticipantName(formData)} Medicare effective dates`,
      ),
      medicarePartAEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'This will be on the front of the Medicare card near "Coverage starts".',
        required: () => true,
      }),
      'view:partATitle': {
        'ui:description': <h3>Medicare Part A</h3>,
      },
      medicarePartBEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'This will be on the front of the Medicare card near "Coverage starts".',
        required: () => true,
      }),
      'view:partBTitle': {
        'ui:description': <h3>Medicare Part B</h3>,
      },
      ...uiProperties,
    },
    schema: {
      type: 'object',
      properties: {
        'view:partATitle': blankSchema,
        medicarePartAEffectiveDate: currentOrPastDateSchema,
        'view:partBTitle': blankSchema,
        medicarePartBEffectiveDate: currentOrPastDateSchema,
        ...schemaProperties,
      },
    },
  };
};

// IF USER SPECIFIES ONLY A/B:
// Create custom description component for Medicare card
const medicarePartAPartBDescription = (
  <div>
    <p>
      You’ll need to submit a copy of your Original Medicare Health Card,
      sometimes referred to as the "red, white, and blue" Medicare card.
    </p>
    <p>
      <b>Your card should include this information:</b>
    </p>
    <ul>
      <li>
        Medicare Part A (listed as HOSPITAL), <strong>and</strong>
      </li>
      <li>
        Medicare Part B (listed as MEDICAL), <strong>and</strong>
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
  frontImageSrc: '/img/ivc-champva/part_a_and_b_front_high_res.png',
  backImageSrc: '/img/ivc-champva/medicare_back_high_res.png',
  frontAltText:
    'Red, white, and blue Medicare card. It states "Medicare Health Insurance" and lists the Medicare number and coverage dates for Part A hospital and Part B medical coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Original Medicare card',
  frontLabel: 'Upload front of Original Medicare card',
  backLabel: 'Upload back of Original Medicare card',
  frontAttachmentId: 'Front of Medicare Parts A or B card',
  backAttachmentId: 'Back of Medicare Parts A or B card',
});

// Define the Medicare A/B card upload page using the generic schema
const medicareABCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare card for Hospital and Medical insurance',
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
      medicarePartAEffectiveDate: currentOrPastDateSchema,
    },
  },
};

// Create custom description component for Medicare Part A card
const medicarePartADescription = (
  <div>
    <p>
      You’ll need to submit a copy of your Original Medicare Health Part A card,
      sometimes called the "red, white, and blue" Medicare card.
    </p>
    <p>
      <b>Your card should include this information</b>
    </p>
    <ul>
      <li>
        Medicare Part A (listed as HOSPITAL), <strong>and</strong>
      </li>
      <li>The date your coverage begins</li>
    </ul>
  </div>
);

// Use the generic card upload schema for Medicare Part A
const {
  uiSchema: medicarePartACardUiSchema,
  schema: medicarePartACardSchema,
} = createCardUploadSchema({
  customDescription: medicarePartADescription,
  frontProperty: 'medicarePartAFrontCard',
  backProperty: 'medicarePartABackCard',
  frontImageSrc: '/img/ivc-champva/part_a_card_front_high_res.png',
  backImageSrc: '/img/ivc-champva/medicare_back_high_res.png',
  frontAltText:
    'Red, white, and blue Medicare card. It states "Medicare Health Insurance" and lists the Medicare number and coverage dates for Part A hospital coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Medicare Part A card',
  frontLabel: 'Upload front of Part A Medicare card',
  backLabel: 'Upload back of Part A Medicare card',
  frontAttachmentId: 'Front of Medicare Parts A or B card',
  backAttachmentId: 'Back of Medicare Parts A or B card',
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
      title: 'Medicare Part B Effective date',
      hint:
        'This will be on the front of your Medicare card near "Coverage starts."',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartBEffectiveDate'],
    properties: {
      medicarePartBEffectiveDate: currentOrPastDateSchema,
      'view:partBTitle': blankSchema,
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
    <p>
      <b>Your card should include this information</b>
    </p>
    <ul>
      <li>
        Medicare Part B (listed as MEDICAL), <strong>and</strong>
      </li>
      <li>The date your coverage begins</li>
    </ul>
  </div>
);

// Use the generic card upload schema for Medicare Part B
const {
  uiSchema: medicarePartBCardUiSchema,
  schema: medicarePartBCardSchema,
} = createCardUploadSchema({
  customDescription: medicarePartBDescription,
  frontProperty: 'medicarePartBFrontCard',
  backProperty: 'medicarePartBBackCard',
  frontImageSrc: '/img/ivc-champva/part_b_card_front_high_res.png',
  backImageSrc: '/img/ivc-champva/medicare_back_high_res.png',
  frontAltText:
    'Red, white, and blue Medicare card. It states "Medicare Health Insurance" and lists the Medicare number and coverage dates for Part B medical coverage.',
  backAltText:
    'Back of a red, white, and blue Medicare card. Includes card usage instructions and the Medicare phone number and website.',
  cardTitle: 'Sample of Medicare Part B card',
  frontLabel: 'Upload front of Part B Medicare card',
  backLabel: 'Upload back of Part B Medicare card',
  frontAttachmentId: 'Front of Medicare Parts A or B card',
  backAttachmentId: 'Back of Medicare Parts A or B card',
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
        background-color="true"
      >
        <p className="vads-u-margin-y--0">
          Applicants that don’t have Medicare Parts A and B or proof of
          ineligibility may not be eligible for CHAMPVA.
        </p>
      </va-alert>,
    ),
    hasPartADenial: {
      ...yesNoUI({
        title:
          'Do you have a notice of disallowance, denial, or other proof of ineligibility for Medicare Part A?',
        hint: ADDITIONAL_FILES_HINT,
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['hasPartADenial'],
    properties: {
      hasPartADenial: yesNoSchema,
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
            {generateParticipantName(formData)} is 65 years old. And you
            selected that they don’t have Medicare Part A.
            <br />
            <br />
            You’ll need to submit a copy of a letter from the Social Security
            Administration. This confirms that they don’t qualify for Medicare
            benefits under anyone’s Social Security number.
          </>
        );
      },
    ),
    ...fileUploadBlurb,
    medicarePartADenialProof: fileUploadUI({
      label: 'Upload proof of Medicare ineligibility',
      attachmentId: 'Letter from the SSA',
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartADenialProof'],
    properties: {
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

// Medicare Part C carrier and effective date page definition
const medicarePartCCarrierEffectiveDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(
          formData,
        )} Medicare Part C carrier and effective date`,
    ),
    medicarePartCCarrier: textUI({
      title: 'Name of insurance carrier',
      hint: 'This is the name of your insurance company.',
    }),
    medicarePartCEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part C effective date',
      hint:
        'This information is on the front of your Medicare card near "Effective date." or "Issue date. If it’s not there, it may be on your plan’s online portal or enrollment documents.',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartCCarrier', 'medicarePartCEffectiveDate'],
    properties: {
      medicarePartCCarrier: textSchema,
      medicarePartCEffectiveDate: currentOrPastDateSchema,
    },
  },
};

// Medicare Part C pharmacy benefits page definition
const medicarePartCPharmacyBenefitsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare pharmacy benefits`,
    ),
    hasPharmacyBenefits: {
      ...yesNoUI({
        title:
          'Does your Medicare Part C (Advantage Plan) provide pharmacy benefits?',
        hint: 'This information is on the front of the card.',
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['hasPharmacyBenefits'],
    properties: {
      hasPharmacyBenefits: yesNoSchema,
    },
  },
};

// Define the Medicare Part C card upload page using the generic schema
const medicarePartCCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare Part C card',
      'You’ll need to submit a copy of the front and back of the applicant’s Medicare Part C (Medicare Advantage Plan) card.',
    ),
    ...fileUploadBlurb,
    medicarePartCFrontCard: fileUploadUI({
      label: 'Upload front of Part C Medicare card',
      attachmentId: 'Front of Medicare Part C card',
    }),
    medicarePartCBackCard: fileUploadUI({
      label: 'Upload back of Part C Medicare card',
      attachmentId: 'Back of Medicare Part C card',
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartCFrontCard', 'medicarePartCBackCard'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      medicarePartCFrontCard: {
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
      medicarePartCBackCard: {
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

// Medicare Part D status page definition
const medicarePartDStatusPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare Part D status`,
    ),
    hasMedicarePartD: {
      ...yesNoUI({
        title: `Do you have Medicare Part D (Drug Coverage) information to provide or update at this time?`,
        hint: ADDITIONAL_FILES_HINT,
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['hasMedicarePartD'],
    properties: {
      hasMedicarePartD: yesNoSchema,
    },
  },
};

// Medicare Part D carrier and effective date page definition
const medicarePartDCarrierEffectiveDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare Part D effective date`,
    ),
    medicarePartDEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part D effective date',
      hint: 'This information is at the top of your card.',
    }),
    medicarePartDTerminationDate: currentOrPastDateUI({
      title: 'Medicare Part D termination date',
      hint: 'Only enter this date if your plan is inactive',
    }),
    'ui:validations': [validateMedicarePartDDates],
  },
  schema: {
    type: 'object',
    required: ['medicarePartDEffectiveDate'],
    properties: {
      medicarePartDEffectiveDate: currentOrPastDateSchema,
      medicarePartDTerminationDate: currentOrPastDateSchema,
    },
  },
};

// Define the Medicare Part D card upload page
const medicarePartDCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare Part D card',
      'You’ll need to submit a copy of the front and back of your Medicare Part D card.',
    ),
    ...fileUploadBlurb,
    medicarePartDFrontCard: fileUploadUI({
      label: 'Upload front of Medicare Part D card',
      attachmentId: 'Front of Medicare Part D card',
    }),
    medicarePartDBackCard: fileUploadUI({
      label: 'Upload back of Medicare Part D card',
      attachmentId: 'Back of Medicare Part D card',
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartDFrontCard', 'medicarePartDBackCard'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      medicarePartDFrontCard: {
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
      medicarePartDBackCard: {
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

/**
 * Returns a list of applicants who are not claimed on a Medicare plan that has
 * been entered in the form.
 * @param {Object} formData Standard formdata object provided to depends functions
 * @returns Array of applicant objects
 */
export function getEligibleApplicantsWithoutMedicare(formData) {
  return formData?.applicants?.filter(
    applicant =>
      !formData?.medicare?.some(
        plan =>
          toHashMemoized(applicant.applicantSSN) === plan?.medicareParticipant,
      ),
  );
}

export const missingMedicarePage = {
  path: 'medicare-information/status',
  title: 'Medicare status',
  depends: (formData, index) => {
    const excluded = getEligibleApplicantsWithoutMedicare(formData);
    const curAppHash = formData?.medicare?.[index]?.medicareParticipant;
    const curApp = formData?.applicants?.find(
      a => toHashMemoized(a.applicantSSN) === curAppHash,
    );
    const age = getAgeInYears(curApp?.applicantDob);
    return age >= 65 && excluded && excluded.length > 0;
  },
  // Something to do with array builder/topBackLink was causing us to
  // always attempt to navigate back inside the medicare array rather
  // than to the summary page, so manually overriding it here.
  onNavBack: ({ goPath }) => {
    goPath('/medicare-information/summary');
  },
  uiSchema: {
    ...titleUI('Medicare status'),
    'view:missingList': {
      'ui:description': <></>,
    },
    hasProofMultipleApplicants: yesNoUI({
      title:
        'Do you have a notice of disallowance, denial, or other proof of ineligibility for Medicare Part A for the applicant or applicants listed?',
      hint: ADDITIONAL_FILES_HINT,
    }),
    'ui:options': {
      updateUiSchema: formData => {
        const excluded = getEligibleApplicantsWithoutMedicare(formData);

        // Show all applicants with no Medicare plan associated
        const content = (
          <>
            <p>
              Based on your responses, the following applicant or applicants
              were not listed as having Medicare.
            </p>
            <ul>
              {excluded?.map(a => (
                <li key={toHashMemoized(a.applicantSSN)}>
                  {`${a?.applicantName?.first} ${a?.applicantName?.last}`}
                </li>
              ))}
            </ul>
            <p>
              If any applicant or applicants listed do have Medicare please
              select "Back" to add a Medicare plan for them.
            </p>
          </>
        );

        return {
          'view:missingList': { 'ui:description': content },
        };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['hasProofMultipleApplicants'],
    properties: {
      'view:missingList': blankSchema,
      hasProofMultipleApplicants: yesNoSchema,
    },
  },
};

export const proofOfIneligibilityUploadPage = {
  path: 'medicare-information/proof-of-ineligibility',
  title: 'Proof of Medicare ineligibility',
  depends: formData => formData?.hasProofMultipleApplicants,
  uiSchema: {
    ...titleUI(
      'Upload proof of Medicare ineligibility',
      <>
        You’ll need to submit a copy of a letter from the Social Security
        Administration that confirms that any applicants don’t qualify for
        Medicare benefits under anyone’s Social Security number. <br /> <br />
        If more than one applicant has a proof of Medicare ineligibility, you
        can submit them all at once.
      </>,
    ),
    ...fileUploadBlurb,
    proofOfIneligibilityUpload: fileUploadUI({
      label: 'Upload proof of Medicare ineligibility',
      attachmentId: 'Letter from the SSA',
    }),
  },
  schema: {
    type: 'object',
    required: ['proofOfIneligibilityUpload'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      proofOfIneligibilityUpload: {
        type: 'array',
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

export const medicarePages = arrayBuilderPages(
  medicareOptions,
  pageBuilder => ({
    medicareSummary: pageBuilder.summaryPage({
      path: 'review-your-medicare-plans',
      title: 'Review your Medicare plans',
      uiSchema: medicareSummaryPage.uiSchema,
      schema: medicareSummaryPage.schema,
    }),
    participant: pageBuilder.itemPage({
      path: 'medicare-participants/:index',
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
      path: 'medicare-over-65-plan-type/:index',
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
      path: 'medicare-under-65-plan-type/:index',
      title: 'Plan type (under 65)',
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
      path: 'medicare-part-a-card/:index',
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
      path: 'medicare-part-b-card/:index',
      title: 'Upload Medicare Part B card',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'b';
      },
      CustomPage: FileFieldCustom,
      ...medicarePartBCardUploadPage,
    }),
    medicarePartADenial: pageBuilder.itemPage({
      path: 'medicare-part-a-denial-notice/:index',
      title: 'Medicare Part A denial',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'b';
      },
      ...medicarePartADenialPage,
    }),
    medicarePartADenialProofUpload: pageBuilder.itemPage({
      path: 'medicare-proof-of-part-a-denial/:index',
      title: 'Upload proof of Medicare ineligibility',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        const hasProof = formData?.medicare?.[index]?.hasPartADenial;
        const curAppHash = formData?.medicare?.[index]?.medicareParticipant;

        const curApp = formData?.applicants?.find(
          a => toHashMemoized(a.applicantSSN) === curAppHash,
        );
        const over65 = getAgeInYears(curApp?.applicantDob) >= 65;

        return planType === 'b' && hasProof && over65;
      },
      CustomPage: FileFieldCustom,
      ...medicarePartADenialProofUploadPage,
    }),
    medicarePartAPartBEffectiveDates: pageBuilder.itemPage({
      path: 'medicare-parts-a-and-b-effective-dates/:index',
      title: 'Medicare effective dates',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'ab';
      },
      ...medicarePartAPartBEffectiveDatesPage(false),
    }),
    medicarePartCABEffectiveDates: pageBuilder.itemPage({
      path: 'medicare-parts-a-and-b-effective-dates-with-part-c/:index',
      title: 'Medicare effective dates',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'c';
      },
      ...medicarePartAPartBEffectiveDatesPage(true),
    }),
    medicareABCardUpload: pageBuilder.itemPage({
      path: 'medicare-parts-a-and-b-card/:index',
      title: 'Upload Medicare card (A/B)',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'ab' || planType === 'c';
      },
      CustomPage: FileFieldCustom,
      ...medicareABCardUploadPage,
    }),
    medicarePartCCarrierEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-c-carrier-and-effective-date/:index',
      title: 'Medicare Part C carrier and effective date',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'c';
      },
      ...medicarePartCCarrierEffectiveDatePage,
    }),
    medicarePartCPharmacyBenefits: pageBuilder.itemPage({
      path: 'medicare-part-c-pharmacy-benefits/:index',
      title: 'Medicare Part C pharmacy benefits',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'c';
      },
      ...medicarePartCPharmacyBenefitsPage,
    }),
    medicarePartCCardUpload: pageBuilder.itemPage({
      path: 'medicare-part-c-card/:index',
      title: 'Upload Medicare Part C card',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'c';
      },
      CustomPage: FileFieldCustom,
      ...medicarePartCCardUploadPage,
    }),
    medicarePartDStatus: pageBuilder.itemPage({
      path: 'medicare-part-d-status/:index',
      title: 'Medicare Part D status',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        return planType === 'ab' || planType === 'c';
      },
      ...medicarePartDStatusPage,
    }),
    medicarePartDCarrierEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-d-carrier-and-effective-date/:index',
      title: 'Medicare Part D carrier and effective date',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        const hasPartD = formData?.medicare?.[index]?.hasMedicarePartD;
        return (planType === 'ab' || planType === 'c') && hasPartD;
      },
      ...medicarePartDCarrierEffectiveDatePage,
    }),
    medicarePartDCardUpload: pageBuilder.itemPage({
      path: 'medicare-part-d-card/:index',
      title: 'Upload Medicare Part D card',
      depends: (formData, index) => {
        const planType = formData?.medicare?.[index]?.medicarePlanType;
        const hasPartD = formData?.medicare?.[index]?.hasMedicarePartD;
        return (planType === 'ab' || planType === 'c') && hasPartD;
      },
      CustomPage: FileFieldCustom,
      ...medicarePartDCardUploadPage,
    }),
  }),
);
