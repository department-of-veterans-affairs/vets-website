import get from 'platform/utilities/data/get';

export const formatCurrency = num => `$${num.toLocaleString()}`;

export const otherRecipientRelationshipExplanationRequired = (
  form,
  index,
  arrayKey,
) => get([arrayKey, index, 'recipientRelationship'], form) === 'OTHER';

export const otherIncomeTypeExplanationRequired = (form, index, arrayIndex) =>
  get([arrayIndex, index, 'incomeType'], form) === 'OTHER';

export const otherGeneratedIncomeTypeExplanationRequired = (form, index) =>
  get(
    ['royaltiesAndOtherProperties', index, 'incomeGenerationMethod'],
    form,
  ) === 'OTHER';

export const recipientNameRequired = (form, index, arrayKey) =>
  get([arrayKey, index, 'recipientRelationship'], form) === 'CHILD' ||
  get([arrayKey, index, 'recipientRelationship'], form) === 'PARENT' ||
  get([arrayKey, index, 'recipientRelationship'], form) === 'CUSTODIAN' ||
  get([arrayKey, index, 'recipientRelationship'], form) === 'OTHER';

export const showRecipientName = recipientRelationship =>
  recipientRelationship === 'CHILD' ||
  recipientRelationship === 'PARENT' ||
  recipientRelationship === 'CUSTODIAN' ||
  recipientRelationship === 'OTHER';
