import React from 'react';
import { isEmpty } from 'lodash';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { format } from 'date-fns';
import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  preparerIdentifications,
  veteranBenefits,
  survivingDependentBenefits,
  submissionApis,
} from '../definitions/constants';
import formConfig from './form';

export const preparerIsVeteran = ({ formData } = {}) => {
  return formData?.preparerIdentification === preparerIdentifications.veteran;
};

export const preparerIsSurvivingDependent = ({ formData } = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.survivingDependent
  );
};

export const preparerIsThirdPartyToTheVeteran = ({ formData } = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.thirdPartyVeteran
  );
};

export const preparerIsThirdPartyToASurvivingDependent = ({
  formData,
} = {}) => {
  return (
    formData?.preparerIdentification ===
    preparerIdentifications.thirdPartySurvivingDependent
  );
};

export const preparerIsThirdParty = ({ formData } = {}) => {
  return (
    preparerIsThirdPartyToTheVeteran({ formData }) ||
    preparerIsThirdPartyToASurvivingDependent({ formData })
  );
};

export const preparerIsSurvivingDependentOrThirdPartyToSurvivingDependent = ({
  formData,
}) => {
  return (
    preparerIsSurvivingDependent({ formData }) ||
    preparerIsThirdPartyToASurvivingDependent({ formData })
  );
};

export const hasActiveCompensationITF = ({ formData } = {}) => {
  return !isEmpty(formData?.['view:activeCompensationITF']);
};

export const hasActivePensionITF = ({ formData } = {}) => {
  return !isEmpty(formData?.['view:activePensionITF']);
};

export const noActiveITF = ({ formData } = {}) => {
  return (
    !hasActiveCompensationITF({ formData }) &&
    !hasActivePensionITF({ formData })
  );
};

export const shouldSeeVeteranBenefitSelection = ({ formData }) => {
  return preparerIsVeteran({ formData }) && noActiveITF({ formData });
};

export const shouldSeeVeteranBenefitSelectionCompensation = ({ formData }) => {
  return preparerIsVeteran({ formData }) && hasActivePensionITF({ formData });
};

export const shouldSeeVeteranBenefitSelectionPension = ({ formData }) => {
  return (
    preparerIsVeteran({ formData }) && hasActiveCompensationITF({ formData })
  );
};

export const hasVeteranPrefill = ({ formData } = {}) => {
  return (
    !isEmpty(formData?.['view:veteranPrefillStore']?.fullName) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.ssn) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.dateOfBirth)
  );
};

export const preparerIsVeteranAndHasPrefill = ({ formData }) => {
  return preparerIsVeteran({ formData }) && hasVeteranPrefill({ formData });
};

export const shouldSeeVeteranPersonalInformation = ({ formData }) => {
  return (
    (preparerIsVeteran({ formData }) && !hasVeteranPrefill({ formData })) ||
    preparerIsThirdPartyToTheVeteran({ formData })
  );
};

export const shouldSeeVeteranIdentificationInformation = ({ formData }) => {
  return (
    !preparerIsVeteran({ formData }) ||
    (preparerIsVeteran({ formData }) && !hasVeteranPrefill({ formData }))
  );
};

export const statementOfTruthFullNamePath = ({ formData } = {}) => {
  if (preparerIsThirdParty({ formData })) {
    return 'thirdPartyPreparerFullName';
  }
  if (preparerIsVeteran({ formData })) {
    if (hasVeteranPrefill({ formData })) {
      return 'view:veteranPrefillStore.fullName';
    }
    return 'veteranFullName';
  }
  return 'survivingDependentFullName';
};

export const benefitSelectionChapterTitle = ({ formData } = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependent:
      return 'Your benefit selection';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s benefit selection';
    case preparerIdentifications.thirdPartySurvivingDependent:
      return 'Claimant’s benefit selection';
    default:
      return 'Your benefit selection';
  }
};

export const survivingDependentPersonalInformationChapterTitle = ({
  formData,
} = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependent:
      return 'Your personal information';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s personal information';
    case preparerIdentifications.thirdPartySurvivingDependent:
      return 'Claimant’s personal information';
    default:
      return 'Your personal information';
  }
};

export const survivingDependentContactInformationChapterTitle = ({
  formData,
} = {}) => {
  switch (formData?.preparerIdentification) {
    case preparerIdentifications.veteran:
    case preparerIdentifications.survivingDependent:
      return 'Your contact information';
    case preparerIdentifications.thirdPartyVeteran:
      return 'Veteran’s contact information';
    case preparerIdentifications.thirdPartySurvivingDependent:
      return 'Claimant’s contact information';
    default:
      return 'Your contact information';
  }
};

export const veteranPersonalInformationChapterTitle = ({ formData } = {}) => {
  if (preparerIsVeteran({ formData })) {
    return 'Your personal information';
  }

  return 'Veteran’s personal information';
};

export const veteranContactInformationChapterTitle = ({ formData } = {}) => {
  if (preparerIsVeteran({ formData })) {
    return 'Your contact information';
  }

  return 'Veteran’s contact information';
};

export const initializeFormDataWithPreparerIdentificationAndPrefill = (
  preparerIdentification,
  veteranPrefillStore,
) => {
  const formData = {
    ...createInitialState(formConfig).data,
    preparerIdentification,
    'view:veteranPrefillStore': veteranPrefillStore,
  };

  if (preparerIsVeteranAndHasPrefill({ formData })) {
    formData.veteranEmail = veteranPrefillStore.email;
  }

  return formData;
};

export const goPathAfterGettingITF = (
  { compensationIntent, pensionIntent },
  formData,
  goPath,
  goNextPath,
  setFormData,
) => {
  const formDataToSet = {
    ...formData,
    'view:activeCompensationITF':
      compensationIntent?.status === 'active' ? compensationIntent : {},
    'view:activePensionITF':
      pensionIntent?.status === 'active' ? pensionIntent : {},
  };

  setFormData(formDataToSet);

  if (
    hasActiveCompensationITF({ formData: formDataToSet }) &&
    hasActivePensionITF({ formData: formDataToSet })
  ) {
    goPath('confirmation');
  } else if (hasActiveCompensationITF({ formData: formDataToSet })) {
    goPath('veteran-benefit-selection-pension');
  } else if (hasActivePensionITF({ formData: formDataToSet })) {
    goPath('veteran-benefit-selection-compensation');
  } else {
    goNextPath();
  }
};

export const getIntentsToFile = ({
  formData,
  goPath,
  goNextPath,
  setFormData,
}) => {
  if (preparerIsVeteran({ formData })) {
    goPath('get-itf-status');

    apiRequest(
      `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/get_intents_to_file`,
    )
      .then(({ compensationIntent, pensionIntent }) => {
        goPathAfterGettingITF(
          { compensationIntent, pensionIntent },
          formData,
          goPath,
          goNextPath,
          setFormData,
        );
      })
      .catch(() => goNextPath());
  } else {
    goNextPath();
  }
};

export const bypassFormCheck = (type, { formData, goPath, goNextPath }) => {
  if (formData?.[type]) {
    goNextPath();
  } else {
    goPath('confirmation');
  }
};

export const confirmationPageFormBypassed = formData => {
  return Object.values(formData.benefitSelection).every(benefit => !benefit);
};

export const confirmationPageAlertStatus = formData => {
  if (confirmationPageFormBypassed(formData)) {
    return 'warning';
  }

  return 'success';
};

export const confirmationPageAlertHeadline = formData => {
  if (confirmationPageFormBypassed(formData)) {
    return 'You already have an intent to file on record';
  }

  return 'You’ve submitted your intent to file';
};

const formatDate = date => {
  if (date) {
    return format(new Date(date), 'MMMM d, yyyy');
  }
  return '';
};

export const confirmationPageAlertHeadlineV2 = ({
  formData,
  submissionApi,
  submitDate,
}) => {
  if (confirmationPageFormBypassed(formData)) {
    return 'You already have an intent to file on record';
  }

  const submitDateStr = formatDate(submitDate);

  if (submissionApi === submissionApis.INTENT_TO_FILE) {
    return `Your form submission was successful on ${submitDateStr}.`;
  }

  if (submissionApi === submissionApis.BENEFITS_INTAKE) {
    return `Form submission started on ${submitDateStr}.`;
  }

  return 'You’ve submitted your intent to file';
};

export const confirmationPageAlertParagraph = formData => {
  if (confirmationPageFormBypassed(formData)) {
    if (
      hasActiveCompensationITF({ formData }) &&
      hasActivePensionITF({ formData })
    ) {
      return 'Our records show that you already have an intent to file for disability compensation and for pension claims.';
    }
    if (hasActiveCompensationITF({ formData })) {
      return `Our records show that you already have an intent to file for disability compensation and it will expire on ${format(
        new Date(formData['view:activeCompensationITF'].expirationDate),
        'MMMM d, yyyy',
      )}.`;
    }
    if (hasActivePensionITF({ formData })) {
      return `Our records show that you already have an intent to file for pension claims and it will expire on ${format(
        new Date(formData['view:activePensionITF'].expirationDate),
        'MMMM d, yyyy',
      )}.`;
    }
  }

  if (
    formData.benefitSelection[veteranBenefits.COMPENSATION] &&
    formData.benefitSelection[veteranBenefits.PENSION]
  ) {
    return 'It may take us a few days to process your intent to file for disability compensation and for pension claims. Then you’ll have 1 year to file your claim.';
  }
  if (formData.benefitSelection[veteranBenefits.COMPENSATION]) {
    return 'It may take us a few days to process your intent to file for disability compensation. Then you’ll have 1 year to file your claim.';
  }
  if (formData.benefitSelection[veteranBenefits.PENSION]) {
    return 'It may take us a few days to process your intent to file for pension claims. Then you’ll have 1 year to file your claim.';
  }
  if (formData.benefitSelection[survivingDependentBenefits.SURVIVOR]) {
    return 'It may take us a few days to process your intent to file for pension claims for survivors. Then you’ll have 1 year to file your claim.';
  }

  return 'It may take us a few days to process your intent to file. Then you’ll have 1 year to file your claim.';
};

const benefitSelectionDisplay = formData => {
  const benefitTypes = [];

  if (formData.benefitSelection[veteranBenefits.COMPENSATION]) {
    benefitTypes.push('disability compensation');
  }
  if (formData.benefitSelection[veteranBenefits.PENSION]) {
    benefitTypes.push('pension claims');
  }
  if (formData.benefitSelection[survivingDependentBenefits.SURVIVOR]) {
    benefitTypes.push('pension claims for survivors');
  }

  return benefitTypes.join(' and ');
};

export const confirmationPageAlertParagraphV2 = ({
  formData,
  submissionApi,
  expirationDate,
  confirmationNumber = '',
}) => {
  if (confirmationPageFormBypassed(formData)) {
    if (
      hasActiveCompensationITF({ formData }) &&
      hasActivePensionITF({ formData })
    ) {
      return 'Our records show that you already have an intent to file for disability compensation and for pension claims.';
    }
    if (hasActiveCompensationITF({ formData })) {
      return `Our records show that you already have an intent to file for disability compensation and it will expire on ${formatDate(
        formData['view:activeCompensationITF'].expirationDate,
      )}.`;
    }
    if (hasActivePensionITF({ formData })) {
      return `Our records show that you already have an intent to file for pension claims and it will expire on ${formatDate(
        formData['view:activePensionITF'].expirationDate,
      )}.`;
    }
  }

  const benefitSelectionStr = benefitSelectionDisplay(formData);

  if (benefitSelectionStr) {
    if (submissionApi === submissionApis.BENEFITS_INTAKE) {
      return (
        <>
          <p>Your intent to file for {benefitSelectionStr} is in progress.</p>
          <p>
            It can take up to 30 days for us to receive your form.
            {confirmationNumber
              ? ` Your confirmation number is ${confirmationNumber}.`
              : ''}
          </p>
        </>
      );
    }
    if (submissionApi === submissionApis.INTENT_TO_FILE) {
      return `You have until ${formatDate(
        expirationDate,
      )} to file for ${benefitSelectionStr}`;
    }
  }

  return <p>Your intent to file is in progress.</p>;
};

export const confirmationPageNextStepsParagraph = formData => {
  if (
    hasActiveCompensationITF({ formData }) &&
    hasActivePensionITF({ formData })
  ) {
    return `Your intent to file for disability compensation expires on ${format(
      new Date(formData['view:activeCompensationITF'].expirationDate),
      'MMMM d, yyyy',
    )} and your intent to file for pension claims expires on ${format(
      new Date(formData['view:activePensionITF'].expirationDate),
      'MMMM d, yyyy',
    )}. You’ll need to file your claims by these dates to get retroactive payments (payments for the time between when you submit your intent to file and when we approve your claim).`;
  }
  if (confirmationPageFormBypassed(formData)) {
    if (hasActiveCompensationITF({ formData })) {
      return `Your intent to file for disability compensation expires on ${format(
        new Date(formData['view:activeCompensationITF'].expirationDate),
        'MMMM d, yyyy',
      )}. If you complete and file your claim before that date and we approve your claim, you may be able to get retroactive payments. Retroactive payments are payments for the time between when we processed your intent to file and when we approved your claim.`;
    }
    if (hasActivePensionITF({ formData })) {
      return `Your intent to file for pension claims expires on ${format(
        new Date(formData['view:activePensionITF'].expirationDate),
        'MMMM d, yyyy',
      )}. If you complete and file your claim before that date and we approve your claim, you may be able to get retroactive payments. Retroactive payments are payments for the time between when we processed your intent to file and when we approved your claim.`;
    }
  }
  if (
    noActiveITF({ formData }) &&
    Object.values(formData.benefitSelection).filter(Boolean).length === 1
  ) {
    let benefitType;

    if (formData.benefitSelection[veteranBenefits.COMPENSATION]) {
      benefitType = 'disability compensation';
    }
    if (formData.benefitSelection[veteranBenefits.PENSION]) {
      benefitType = 'pension claims';
    }
    if (formData.benefitSelection[survivingDependentBenefits.SURVIVOR]) {
      benefitType = 'pension claims for survivors';
    }

    return `Your intent to file for ${benefitType} expires one year from today. You’ll need to file your claim by this date to get retroactive payments (payments for the time between when you submit your intent to file and when we approve your claim).`;
  }

  return null;
};
