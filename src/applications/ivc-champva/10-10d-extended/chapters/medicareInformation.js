import React from 'react';
import { useSelector } from 'react-redux';
import { memoize } from 'lodash';
import set from 'platform/utilities/data/set';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
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
  titleUI,
  descriptionUI,
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
  privWrapper,
} from '../../shared/utilities';
import { ADDITIONAL_FILES_HINT } from '../../shared/constants';
import { replaceStrValues } from '../helpers/formatting';
import {
  validateMedicarePartDDates,
  validateMedicarePlan,
} from '../helpers/validations';
import {
  selectMedicareParticipantPage,
  SelectMedicareParticipantPage,
} from './SelectMedicareParticipantsPage';
import {
  MedicarePartADescription,
  MedicarePartBDescription,
  MedicarePartsAbDescription,
} from '../components/FormDescriptions/MedicarePlanDescriptions';
import MedicarePartCAddtlInfo from '../components/FormDescriptions/MedicarePartCAddtlInfo';
import ProofOfMedicareAlert from '../components/FormAlerts/ProofOfMedicareAlert';
import content from '../locales/en/content.json';

// declare static content constants
const MEDICARE_TYPE_LABELS = {
  ab: 'Original Medicare Parts A and B (Hospital and Medical Insurance)',
  c:
    'Medicare Part C, also known as Medicare Advantage (includes previous enrollment in Part A and B)',
  a: 'Medicare Part A only (Hospital Insurance)',
  b: 'Medicare Part B only (Medical Insurance)',
};

// helpers for hash memorization and age comparison
const toHashMemoized = memoize(str => toHash(str));

const getIsUnder65 = (applicants, medicare, index) => {
  const curAppHash = medicare?.[index]?.medicareParticipant;
  const curApp = applicants?.find(
    a => toHashMemoized(a.applicantSsn) === curAppHash,
  );
  return getAgeInYears(curApp?.applicantDob) < 65;
};

const getPlanKeys = isUnder65 =>
  isUnder65 ? ['ab', 'c', 'a'] : ['ab', 'c', 'a', 'b'];

// helpers to determine plan status values
const hasPartsAB = ({ medicare }, index) =>
  medicare?.[index]?.medicarePlanType === 'ab';
const hasPartA = ({ medicare }, index) =>
  medicare?.[index]?.medicarePlanType === 'a';
const hasPartB = ({ medicare }, index) =>
  medicare?.[index]?.medicarePlanType === 'b';
const hasPartC = ({ medicare }, index) =>
  medicare?.[index]?.medicarePlanType === 'c';
const hasPartsABorC = (formData, index) =>
  hasPartsAB(formData, index) || hasPartC(formData, index);
const hasPartD = (formData, index) =>
  hasPartsABorC(formData, index) &&
  formData.medicare?.[index]?.hasMedicarePartD;

/**
 * Generate a possessive display name for the current Medicare participant.
 *
 * Finds the matching applicant in `item['view:applicantObjects']` by comparing
 * `item.medicareParticipant` (a hashed SSN) to `toHashMemoized(applicant.applicantSsn)`,
 * then formats the name via `applicantWording`. Returns a possessive form like
 * `"Jane Doe's"` when possible; falls back to `"applicant"` when no name can be
 * produced, and `"No participant"` when `item` is falsy.
 *
 * @param {Object} [item] - Container holding participant context.
 * @param {Array<Object>} [item['view:applicantObjects']=[]] - Applicant records that include `applicantSsn`.
 * @param {string} [item.medicareParticipant] - Hashed SSN used to identify the participant.
 * @returns {string} Possessive participant name (e.g., `"Jane Doe's"`), `"applicant"`, or `"No participant"`.
 */
export const generateParticipantName = item => {
  if (item) {
    const applicantObjects = item['view:applicantObjects'] || [];
    const match = applicantObjects.find(
      app => item?.medicareParticipant === toHashMemoized(app.applicantSsn),
    );
    const name = applicantWording(match, false, false, false);
    return name.length > 0 ? `${name}’s` : 'Applicant';
  }
  return 'No participant';
};

/**
 * Return applicants who do not have a Medicare plan recorded.
 *
 * Compares each `formData.applicants[*].applicantSsn` (hashed via `toHashMemoized`)
 * against every `formData.medicare[*].medicareParticipant` value. Any applicant
 * whose hashed SSN does **not** appear in the Medicare list is included.
 *
 * If `formData.applicants` is missing/undefined, the function returns `undefined`.
 *
 * @param {Object} formData - Form data containing applicants and Medicare records.
 * @param {Object[]} [formData.applicants] - Applicant records; each should include `applicantSsn`.
 * @param {Object[]} [formData.medicare] - Medicare records; each may include `medicareParticipant` (hashed SSN).
 * @returns {Object[]|undefined} Array of applicants without Medicare, or `undefined` if no applicants list is present.
 */
export const getEligibleApplicantsWithoutMedicare = formData =>
  formData?.applicants?.filter(
    a =>
      !formData?.medicare?.some(
        plan => toHashMemoized(a.applicantSsn) === plan?.medicareParticipant,
      ),
  );

// ArrayBuilder options
export const medicareOptions = {
  arrayPath: 'medicare',
  nounSingular: 'plan',
  nounPlural: 'plans',
  required: false,
  isItemIncomplete: validateMedicarePlan,
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
    cancelAddTitle: () => content['medicare--cancel-add-title'],
    cancelAddDescription: () => content['medicare--cancel-add-description'],
    cancelAddNo: () => content['arraybuilder--button-cancel-no'],
    cancelAddYes: () => content['arraybuilder--button-cancel-yes'],
    cancelEditTitle: props => {
      const itemName = props.getItemName(
        props.itemData,
        props.index,
        props.formData,
      );
      return itemName
        ? replaceStrValues(
            content['medicare--cancel-edit-item-title'],
            itemName,
          )
        : content['medicare--cancel-edit-noun-title'];
    },
    cancelEditDescription: () => content['medicare--cancel-edit-description'],
    cancelEditNo: () => content['arraybuilder--button-delete-no'],
    cancelEditYes: () => content['arraybuilder--button-cancel-yes'],
    deleteDescription: props => {
      const itemName = props.getItemName(
        props.itemData,
        props.index,
        props.formData,
      );
      return itemName
        ? replaceStrValues(
            content['medicare--delete-item-description'],
            itemName,
          )
        : content['medicare--delete-noun-description'];
    },
    deleteNo: () => content['arraybuilder--button-delete-no'],
    deleteYes: () => content['arraybuilder--button-delete-yes'],
    summaryTitle: () => content['medicare--summary-title'],
    summaryTitleWithoutItems: () => content['medicare--summary-title-no-items'],
  },
};

// Summary page options
const yesNoOptions = {
  title: content['medicare--yes-no-title'],
  hint: null,
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
};
const yesNoOptionsMore = {
  title: content['medicare--yes-no-title'],
  hint: content['medicare--yes-no-hint'],
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '4',
};

// declare page schemas
const medicareSummaryPage = {
  uiSchema: {
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

const medicarePlanTypes = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare plan types`,
    ),
    medicarePlanType: {
      ...radioUI({
        title: 'Which Medicare plan does this applicant have?',
        labels: MEDICARE_TYPE_LABELS,
        updateSchema: (
          _formData,
          schema,
          _uiSchema,
          index,
          _fields,
          { applicants, medicare } = {},
        ) => {
          const isUnder65 = getIsUnder65(applicants, medicare, index);
          const keys = getPlanKeys(isUnder65);
          return set('enum', keys, schema);
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePlanType'],
    properties: {
      medicarePlanType: radioSchema([]),
    },
  },
};

const medicarePartAPartBEffectiveDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare effective dates`,
    ),
    'view:medicarePartAEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part A',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartAEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'This will be on the front of the Medicare card near “Coverage starts.”',
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
    'view:medicarePartBEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part B',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartBEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'This will be on the front of the Medicare card near “Coverage starts.”',
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
    'view:medicarePartCDescription': {
      'ui:description': MedicarePartCAddtlInfo,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicarePartAEffectiveDate': {
        type: 'object',
        required: ['medicarePartAEffectiveDate'],
        properties: {
          medicarePartAEffectiveDate: currentOrPastDateSchema,
        },
      },
      'view:medicarePartBEffectiveDate': {
        type: 'object',
        required: ['medicarePartBEffectiveDate'],
        properties: {
          medicarePartBEffectiveDate: currentOrPastDateSchema,
        },
      },
      'view:medicarePartCDescription': blankSchema,
    },
  },
};

const {
  uiSchema: medicareCardUiSchema,
  schema: medicareCardSchema,
} = createCardUploadSchema({
  customDescription: MedicarePartsAbDescription,
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

const medicareABCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare card for Hospital and Medical insurance',
    ),
    ...medicareCardUiSchema,
  },
  schema: medicareCardSchema,
};

const medicarePartAEffectiveDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare effective dates`,
    ),
    'view:medicarePartAEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part A',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartAEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'You may find the effective date on the front of the Medicare card near “Coverage starts” or “Effective date.”',
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicarePartAEffectiveDate': {
        type: 'object',
        required: ['medicarePartAEffectiveDate'],
        properties: {
          medicarePartAEffectiveDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

const {
  uiSchema: medicarePartACardUiSchema,
  schema: medicarePartACardSchema,
} = createCardUploadSchema({
  customDescription: MedicarePartADescription,
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

const medicarePartACardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Upload Medicare Part A card'),
    ...medicarePartACardUiSchema,
  },
  schema: medicarePartACardSchema,
};

const medicarePartBEffectiveDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare effective dates`,
    ),
    'view:medicarePartBEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part B',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartBEffectiveDate: currentOrPastDateUI({
        title: 'Effective date',
        hint:
          'This will be on the front of the Medicare card near “Coverage starts.”',
        classNames: 'vads-u-margin-top--neg1p5',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:medicarePartBEffectiveDate': {
        type: 'object',
        required: ['medicarePartBEffectiveDate'],
        properties: {
          medicarePartBEffectiveDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

const {
  uiSchema: medicarePartBCardUiSchema,
  schema: medicarePartBCardSchema,
} = createCardUploadSchema({
  customDescription: MedicarePartBDescription,
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

const medicarePartBCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Upload Medicare Part B card'),
    ...medicarePartBCardUiSchema,
  },
  schema: medicarePartBCardSchema,
};

const medicarePartADenialPage = dataKey => {
  const PageTitle = ({ formContext }) => {
    const formData = useSelector(state => state.form.data);
    const n = Number(formContext.pagePerItemIndex);
    const itemIndex = Number.isFinite(n) && n >= 0 ? n : null;
    if (formData?.medicare?.[itemIndex]?.medicareParticipant) {
      return `${generateParticipantName(
        formData?.medicare?.[itemIndex],
      )} Medicare status`;
    }
    const apps = getEligibleApplicantsWithoutMedicare(formData) ?? [];
    const item = apps.find(a => getAgeInYears(a.applicantDob) >= 65);
    return `${applicantWording(item, false, false, false)}’s Medicare status`;
  };
  return {
    uiSchema: {
      'view:addtlInfo': { ...descriptionUI(ProofOfMedicareAlert) },
      [`view:${dataKey}`]: {
        ...arrayBuilderItemSubsequentPageTitleUI(PageTitle),
        [dataKey]: {
          ...yesNoUI({
            title:
              'Does the applicant have a notice of disallowance, denial, or other proof of ineligibility for Medicare Part A?',
            hint: ADDITIONAL_FILES_HINT,
          }),
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        'view:addtlInfo': blankSchema,
        [`view:${dataKey}`]: {
          type: 'object',
          required: [dataKey],
          properties: {
            [dataKey]: yesNoSchema,
          },
        },
      },
    },
  };
};

const medicarePartADenialProofUploadPage = dataKey => {
  const description =
    dataKey === 'medicarePartADenialProof' ? (
      ({ formData }) => {
        return (
          <>
            <p>
              {privWrapper(generateParticipantName(formData))} is age 65 or
              older. You selected that they don’t have Medicare Part A.
            </p>
            <p>
              You’ll need to submit a copy of a letter from the Social Security
              Administration. This confirms that they don’t qualify for Medicare
              benefits under anyone’s Social Security number.
            </p>
          </>
        );
      }
    ) : (
      <>
        <p>
          You’ll need to submit a copy of a letter from the Social Security
          Administration that confirms that any applicants don’t qualify for
          Medicare benefits under anyone’s Social Security number.
        </p>
        <p>
          If more than one applicant has a proof of Medicare ineligibility, you
          can submit them all at once.
        </p>
      </>
    );
  return {
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        'Upload proof of Medicare ineligibility',
        description,
      ),
      ...fileUploadBlurb,
      [dataKey]: fileUploadUI({
        label: 'Upload proof of Medicare ineligibility',
        attachmentId: 'Letter from the SSA',
      }),
    },
    schema: {
      type: 'object',
      required: [dataKey],
      properties: {
        'view:fileUploadBlurb': blankSchema,
        [dataKey]: {
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
};

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
      hint: 'This is the name of the insurance company.',
    }),
    medicarePartCEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part C effective date',
      hint:
        'This information is on the front of the Medicare card near “Effective date” or “Issue date.” If it’s not there, it may be on the plan’s online portal or enrollment documents.',
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

const medicarePartCPharmacyBenefitsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare pharmacy benefits`,
    ),
    hasPharmacyBenefits: {
      ...yesNoUI({
        title:
          'Does the applicant’s Medicare Part C (Advantage Plan) provide pharmacy benefits?',
        hint: 'This information is on the front of the card.',
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

const medicarePartCCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare card for Hospital and Medical insurance',
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

const medicarePartDStatusPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare Part D status`,
    ),
    hasMedicarePartD: {
      ...yesNoUI({
        title:
          'Does the applicant have Medicare Part D (Drug Coverage) information to provide or update at this time?',
        hint: ADDITIONAL_FILES_HINT,
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

const medicarePartDCarrierEffectiveDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${generateParticipantName(formData)} Medicare Part D effective date`,
    ),
    medicarePartDEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part D effective date',
      hint: 'This information is at the top of the card.',
    }),
    medicarePartDTerminationDate: currentOrPastDateUI({
      title: 'Medicare Part D termination date',
      hint: 'Only enter this date if the plan is inactive',
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

const medicarePartDCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare Part D card',
      'You’ll need to submit a copy of the front and back of the applicant’s Medicare Part D card.',
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

export const medicareStatusPage = {
  path: 'medicare-status',
  title: 'Medicare status',
  depends: formData => {
    const excluded = getEligibleApplicantsWithoutMedicare(formData) ?? [];
    return excluded.some(a => getAgeInYears(a.applicantDob) >= 65);
  },
  ...medicarePartADenialPage('hasProofMultipleApplicants'),
};

export const medicareProofOfIneligibilityPage = {
  path: 'medicare-proof-of-ineligibility',
  title: 'Proof of Medicare ineligibility',
  depends: formData =>
    formData?.['view:hasProofMultipleApplicants']?.hasProofMultipleApplicants,
  CustomPage: FileFieldCustom,
  ...medicarePartADenialProofUploadPage('proofOfIneligibilityUpload'),
};

// define ArrayBuilder pages
export const medicarePages = arrayBuilderPages(
  medicareOptions,
  pageBuilder => ({
    medicareSummary: pageBuilder.summaryPage({
      path: 'medicare-plans',
      title: 'Medicare plans',
      uiSchema: medicareSummaryPage.uiSchema,
      schema: medicareSummaryPage.schema,
    }),
    participant: pageBuilder.itemPage({
      path: 'medicare-participants/:index',
      title: 'Medicare participant',
      ...selectMedicareParticipantPage,
      CustomPage: SelectMedicareParticipantPage,
      CustomPageReview: null,
    }),
    medicarePlanType: pageBuilder.itemPage({
      path: 'medicare-plan-type/:index',
      title: 'Medicare plan type',
      ...medicarePlanTypes,
    }),
    medicarePartAEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-a-effective-date/:index',
      title: 'Medicare Part A effective date',
      depends: hasPartA,
      ...medicarePartAEffectiveDatePage,
    }),
    medicarePartACardUpload: pageBuilder.itemPage({
      path: 'medicare-part-a-card/:index',
      title: 'Upload Medicare Part A card',
      depends: hasPartA,
      CustomPage: FileFieldCustom,
      ...medicarePartACardUploadPage,
    }),
    medicarePartBEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-b-effective-date/:index',
      title: 'Medicare Part B effective date',
      depends: hasPartB,
      ...medicarePartBEffectiveDatePage,
    }),
    medicarePartBCardUpload: pageBuilder.itemPage({
      path: 'medicare-part-b-card/:index',
      title: 'Upload Medicare Part B card',
      depends: hasPartB,
      CustomPage: FileFieldCustom,
      ...medicarePartBCardUploadPage,
    }),
    medicarePartADenial: pageBuilder.itemPage({
      path: 'medicare-part-a-denial-notice/:index',
      title: 'Medicare Part A denial',
      depends: hasPartB,
      ...medicarePartADenialPage('hasPartADenial'),
    }),
    medicarePartADenialProofUpload: pageBuilder.itemPage({
      path: 'medicare-proof-of-part-a-denial/:index',
      title: 'Upload proof of Medicare ineligibility',
      depends: ({ applicants, medicare }, index) => {
        const hasProof =
          medicare?.[index]?.['view:hasPartADenial']?.hasPartADenial;
        const over65 = !getIsUnder65(applicants, medicare, index);
        return hasPartB({ medicare }, index) && hasProof && over65;
      },
      CustomPage: FileFieldCustom,
      ...medicarePartADenialProofUploadPage('medicarePartADenialProof'),
    }),
    medicarePartAPartBEffectiveDates: pageBuilder.itemPage({
      path: 'medicare-parts-a-and-b-effective-dates/:index',
      title: 'Medicare effective dates',
      depends: hasPartsABorC,
      ...medicarePartAPartBEffectiveDatesPage,
    }),
    medicareABCardUpload: pageBuilder.itemPage({
      path: 'medicare-parts-a-and-b-card/:index',
      title: 'Upload Medicare card (A/B)',
      depends: hasPartsABorC,
      CustomPage: FileFieldCustom,
      ...medicareABCardUploadPage,
    }),
    medicarePartCCarrierEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-c-carrier-and-effective-date/:index',
      title: 'Medicare Part C carrier and effective date',
      depends: hasPartC,
      ...medicarePartCCarrierEffectiveDatePage,
    }),
    medicarePartCPharmacyBenefits: pageBuilder.itemPage({
      path: 'medicare-part-c-pharmacy-benefits/:index',
      title: 'Medicare Part C pharmacy benefits',
      depends: hasPartC,
      ...medicarePartCPharmacyBenefitsPage,
    }),
    medicarePartCCardUpload: pageBuilder.itemPage({
      path: 'medicare-part-c-card/:index',
      title: 'Upload Medicare Part C card',
      depends: hasPartC,
      CustomPage: FileFieldCustom,
      ...medicarePartCCardUploadPage,
    }),
    medicarePartDStatus: pageBuilder.itemPage({
      path: 'medicare-part-d-status/:index',
      title: 'Medicare Part D status',
      depends: hasPartsABorC,
      ...medicarePartDStatusPage,
    }),
    medicarePartDCarrierEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-d-carrier-and-effective-date/:index',
      title: 'Medicare Part D carrier and effective date',
      depends: hasPartD,
      ...medicarePartDCarrierEffectiveDatePage,
    }),
    medicarePartDCardUpload: pageBuilder.itemPage({
      path: 'medicare-part-d-card/:index',
      title: 'Upload Medicare Part D card',
      depends: hasPartD,
      CustomPage: FileFieldCustom,
      ...medicarePartDCardUploadPage,
    }),
  }),
);
