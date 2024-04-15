import {
  claimantIdentificationDisplayOptions,
  claimantIdentificationKeys,
} from '../definitions/constants';

export const getClaimantIdentificationText = formData => {
  return (
    claimantIdentificationDisplayOptions[(formData?.claimantIdentification)] ||
    'Claimant'
  );
};

export const claimantIsVeteran = ({ formData } = {}) => {
  // key 0 corresponds to claimant is the Veteran
  return formData?.claimantIdentification === claimantIdentificationKeys[0];
};

export const claimantIsSpouse = ({ formData } = {}) => {
  // key 1 corresponds to claimant is the Spouse
  return formData?.claimantIdentification === claimantIdentificationKeys[1];
};

export const claimantIsParent = ({ formData } = {}) => {
  // key 2 corresponds to claimant is the Parent
  return formData?.claimantIdentification === claimantIdentificationKeys[2];
};

export const claimantIsChild = ({ formData } = {}) => {
  // key 3 corresponds to claimant is the Child
  return formData?.claimantIdentification === claimantIdentificationKeys[3];
};

export const claimantIsNotVeteran = ({ formData } = {}) => {
  // key 0 corresponds to claimant is the Veteran
  return formData?.claimantIdentification !== claimantIdentificationKeys[0];
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

export const preparerQualificationsQuestionTitle = claimant => {
  return `What’s your relationship to the ${claimant}? You can select more than one.`;
};

export const preparerQualificationsQuestionLabels = claimant => {
  return {
    caregiver: `I’m responsible for the care of the ${claimant}.`,
    courtAppointedRep: `I’m appointed by the court to represent the ${claimant}.`,
    attorney: `I’m authorized to make decisions for the ${claimant} under durable power of attorney, as an attorney-in-fact or agent.`,
    manager: `I’m a manager or principal officer representing an institution that’s responsible for the care of the ${claimant}.`,
  };
};

export const preparerSigningReasonQuestionTitle = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `Why does the ${claimantIdentificationText} need you to sign for them? You can select more than one.`;
};

export const claimantExpectedInformationDescription = ({ formData } = {}) => {
  const claimantIdentificationText = getClaimantIdentificationText(formData);
  return `Now, we’ll ask you about the ${claimantIdentificationText} that you’re signing for.`;
};

export const veteranDescriptionText = ({ formData } = {}) => {
  let descriptionText = '';
  if (claimantIsNotVeteran({ formData })) {
    descriptionText =
      'Next we’ll ask you about the Veteran connected to the person you’re signing for.';
  } else {
    descriptionText =
      'Next we’ll ask you about the Veteran you’re signing for.';
  }
  return descriptionText;
};
