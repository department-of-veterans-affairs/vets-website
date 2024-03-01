import { isEmpty } from 'lodash';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { format } from 'date-fns';
import {
  preparerIdentifications,
  veteranBenefits,
  survivingDependentBenefits,
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

export const hasVeteranPrefill = ({ formData } = {}) => {
  return (
    !isEmpty(formData?.['view:veteranPrefillStore']?.fullName) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.ssn) &&
    !isEmpty(formData?.['view:veteranPrefillStore']?.dateOfBirth)
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
  if (formData?.preparerIdentification === preparerIdentifications.veteran) {
    return 'Your personal information';
  }

  return 'Veteran’s personal information';
};

export const veteranContactInformationChapterTitle = ({ formData } = {}) => {
  if (formData?.preparerIdentification === preparerIdentifications.veteran) {
    return 'Your contact information';
  }

  return 'Veteran’s contact information';
};

export const initializeFormDataWithPreparerIdentificationAndPrefill = (
  preparerIdentification,
  veteranPrefillStore,
) => {
  return {
    ...createInitialState(formConfig).data,
    preparerIdentification,
    'view:veteranPrefillStore': veteranPrefillStore,
  };
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

  return 'It may take us a few days to process your intent to file. Then you’ll have 1 year to file your claim.';
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
