import { claimantIdentificationOptions } from '../definitions/constants';

const getClaimantIdentificationText = formData => {
  return (
    claimantIdentificationOptions[(formData?.claimantIdentification)] ||
    'Claimant'
  );
};

export const claimantPersonalInformationTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} personal information`;
};

export const claimantSsnTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} identification information`;
};

export const claimantAddressTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} mailing address`;
};

export const claimantContactInformationTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `${claimantIdentificationText} contact information`;
};

export const preparerQualificationsRelationshipQuestionTitle = ({
  formData,
} = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `What is your relationship to the ${claimantIdentificationText}? (Check all that apply)`;
};

export const preparerSigningReasonQuestionTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `Why does the ${claimantIdentificationText} need you to sign on their behalf? (Check all that apply)`;
};
