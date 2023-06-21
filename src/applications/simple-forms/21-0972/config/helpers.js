import { claimantIdentificationOptions } from '../definitions/constants';

const getClaimantIdentificationText = formData => {
  return (
    claimantIdentificationOptions[formData.claimantIdentification] || 'Claimant'
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
