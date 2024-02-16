import { isEmpty } from 'lodash';
import set from '@department-of-veterans-affairs/platform-forms-system/set';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { preparerIdentifications } from '../definitions/constants';
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

export const statementOfTruthFullNamePath = ({ formData } = {}) => {
  if (preparerIsThirdParty({ formData })) {
    return 'thirdPartyPreparerFullName';
  }
  if (preparerIsVeteran({ formData })) {
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

export const initializeFormDataWithPreparerIdentification = preparerIdentification => {
  return set(
    'preparerIdentification',
    preparerIdentification,
    createInitialState(formConfig).data,
  );
};
