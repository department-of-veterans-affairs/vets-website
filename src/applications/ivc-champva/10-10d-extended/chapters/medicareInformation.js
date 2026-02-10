import React from 'react';
import { memoize } from 'lodash';
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
import { toHash, getAgeInYears } from '../../shared/utilities';
import { ADDITIONAL_FILES_HINT } from '../../shared/constants';
import { medicarePageTitleUI } from '../helpers/titles';
import {
  generateParticipantName,
  getEligibleApplicantsWithoutMedicare,
  replaceStrValues,
  validateMedicarePartDDates,
  validateMedicarePlan,
} from '../helpers';
import {
  futureDateUI,
  futureDateSchema,
  attachmentUI,
  singleAttachmentSchema,
} from '../definitions';
import medicareParticipant from './medicareInformation/participants';
import medicareNumber from './medicareInformation/medicareNumber';
import medicarePartACardUpload from './medicareInformation/partACardUpload';
import medicarePartsAPartBCardUpload from './medicareInformation/partAPartBCardUpload';
import medicarePartBCardUpload from './medicareInformation/partBCardUpload';
import MedicarePartCAddtlInfo from '../components/FormDescriptions/MedicarePartCAddtlInfo';
import ProofOfMedicareAlert from '../components/FormAlerts/ProofOfMedicareAlert';
import FileUploadDescription from '../components/FormDescriptions/FileUploadDescription';
import MedicareSummaryCard from '../components/FormDescriptions/MedicareSummaryCard';
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
  formData.medicare?.[index]?.hasMedicarePartD;

export const medicareOptions = {
  arrayPath: 'medicare',
  nounSingular: 'plan',
  nounPlural: 'plans',
  required: false,
  isItemIncomplete: validateMedicarePlan,
  maxItems: formData => formData?.applicants?.length,
  text: {
    getItemName: generateParticipantName,
    cardDescription: MedicareSummaryCard,
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
    ...medicarePageTitleUI('Medicare plan types'),
    medicarePlanType: {
      ...radioUI({
        title: 'Which Medicare plan does this applicant have?',
        labels: MEDICARE_TYPE_LABELS,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePlanType'],
    properties: {
      medicarePlanType: radioSchema(Object.keys(MEDICARE_TYPE_LABELS)),
    },
  },
};

const medicarePartAPartBEffectiveDatesPage = {
  uiSchema: {
    ...medicarePageTitleUI('Medicare effective dates'),
    'view:medicarePartAEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part A',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartAEffectiveDate: futureDateUI({
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
      medicarePartBEffectiveDate: futureDateUI({
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
          medicarePartAEffectiveDate: futureDateSchema,
        },
      },
      'view:medicarePartBEffectiveDate': {
        type: 'object',
        required: ['medicarePartBEffectiveDate'],
        properties: {
          medicarePartBEffectiveDate: futureDateSchema,
        },
      },
      'view:medicarePartCDescription': blankSchema,
    },
  },
};

const medicarePartAEffectiveDatePage = {
  uiSchema: {
    ...medicarePageTitleUI('Medicare effective dates'),
    'view:medicarePartAEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part A',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartAEffectiveDate: futureDateUI({
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
          medicarePartAEffectiveDate: futureDateSchema,
        },
      },
    },
  },
};

const medicarePartBEffectiveDatePage = {
  uiSchema: {
    ...medicarePageTitleUI('Medicare effective dates'),
    'view:medicarePartBEffectiveDate': {
      ...titleUI({
        title: 'Medicare Part B',
        headerLevel: 2,
        headerStyleLevel: 3,
      }),
      medicarePartBEffectiveDate: futureDateUI({
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
          medicarePartBEffectiveDate: futureDateSchema,
        },
      },
    },
  },
};

const medicarePartADenialPage = dataKey => ({
  uiSchema: {
    'view:addtlInfo': { ...descriptionUI(ProofOfMedicareAlert) },
    [`view:${dataKey}`]: {
      ...medicarePageTitleUI('Medicare status'),
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
});

const medicarePartADenialProofUploadPage = dataKey => {
  const description =
    dataKey === 'medicarePartADenialProof' ? (
      <>
        <p>
          This applicant is age 65 or older. You selected that they don’t have
          Medicare Part A.
        </p>
        <p>
          You’ll need to submit a copy of a letter from the Social Security
          Administration. This confirms that they don’t qualify for Medicare
          benefits under anyone’s Social Security number.
        </p>
      </>
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
      ...descriptionUI(FileUploadDescription),
      [dataKey]: attachmentUI({
        label: 'Upload proof of Medicare ineligibility',
        attachmentId: 'Letter from the SSA',
      }),
    },
    schema: {
      type: 'object',
      required: [dataKey],
      properties: {
        [dataKey]: singleAttachmentSchema,
      },
    },
  };
};

const medicarePartCCarrierEffectiveDatePage = {
  uiSchema: {
    ...medicarePageTitleUI('Medicare Part C carrier and effective date'),
    medicarePartCCarrier: textUI({
      title: 'Name of insurance carrier',
      hint: 'This is the name of the insurance company.',
    }),
    medicarePartCEffectiveDate: futureDateUI({
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
      medicarePartCEffectiveDate: futureDateSchema,
    },
  },
};

const medicarePartCCardUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload Medicare card for Hospital and Medical insurance',
      'You’ll need to submit a copy of the front and back of the applicant’s Medicare Part C (Medicare Advantage Plan) card.',
    ),
    ...descriptionUI(FileUploadDescription),
    medicarePartCFrontCard: attachmentUI({
      label: 'Upload front of Part C Medicare card',
      attachmentId: 'Front of Medicare Part C card',
    }),
    medicarePartCBackCard: attachmentUI({
      label: 'Upload back of Part C Medicare card',
      attachmentId: 'Back of Medicare Part C card',
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartCFrontCard', 'medicarePartCBackCard'],
    properties: {
      medicarePartCFrontCard: singleAttachmentSchema,
      medicarePartCBackCard: singleAttachmentSchema,
    },
  },
};

const medicarePartDStatusPage = {
  uiSchema: {
    ...medicarePageTitleUI('Medicare Part D status'),
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
    ...medicarePageTitleUI('Medicare Part D effective date'),
    medicarePartDEffectiveDate: futureDateUI({
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
      medicarePartDEffectiveDate: futureDateSchema,
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
    ...descriptionUI(FileUploadDescription),
    medicarePartDFrontCard: attachmentUI({
      label: 'Upload front of Medicare Part D card',
      attachmentId: 'Front of Medicare Part D card',
    }),
    medicarePartDBackCard: attachmentUI({
      label: 'Upload back of Medicare Part D card',
      attachmentId: 'Back of Medicare Part D card',
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePartDFrontCard', 'medicarePartDBackCard'],
    properties: {
      medicarePartDFrontCard: singleAttachmentSchema,
      medicarePartDBackCard: singleAttachmentSchema,
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
  ...medicarePartADenialProofUploadPage('proofOfIneligibilityUpload'),
};

// define ArrayBuilder pages
export const medicarePages = arrayBuilderPages(
  medicareOptions,
  pageBuilder => ({
    medicareSummary: pageBuilder.summaryPage({
      path: 'medicare-plans',
      title: 'Medicare plans',
      ...medicareSummaryPage,
    }),
    participant: pageBuilder.itemPage({
      path: 'medicare-participants/:index',
      title: 'Medicare participant',
      ...medicareParticipant,
    }),
    medicarePlanType: pageBuilder.itemPage({
      path: 'medicare-plan-type/:index',
      title: 'Medicare plan type',
      ...medicarePlanTypes,
    }),
    medicareBeneficiaryIdentifier: pageBuilder.itemPage({
      path: 'medicare-beneficiary-identifier/:index',
      title: 'Medicare beneficiary identifier',
      ...medicareNumber,
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
      ...medicarePartACardUpload,
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
      ...medicarePartBCardUpload,
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
      ...medicarePartsAPartBCardUpload,
    }),
    medicarePartCCarrierEffectiveDate: pageBuilder.itemPage({
      path: 'medicare-part-c-carrier-and-effective-date/:index',
      title: 'Medicare Part C carrier and effective date',
      depends: hasPartC,
      ...medicarePartCCarrierEffectiveDatePage,
    }),
    medicarePartCCardUpload: pageBuilder.itemPage({
      path: 'medicare-part-c-card/:index',
      title: 'Upload Medicare Part C card',
      depends: hasPartC,
      ...medicarePartCCardUploadPage,
    }),
    medicarePartDStatus: pageBuilder.itemPage({
      path: 'medicare-part-d-status/:index',
      title: 'Medicare Part D status',
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
      ...medicarePartDCardUploadPage,
    }),
  }),
);
