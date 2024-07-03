import get from 'platform/utilities/data/get';

export const formatCurrency = num => `$${num.toLocaleString()}`;

export const otherExplanationRequired = (form, index) =>
  get(['associatedIncomes', index, 'recipientRelationship'], form) === 'OTHER';

export const otherIncomeTypeExplanationRequired = (form, index) =>
  get(['associatedIncomes', index, 'incomeType'], form) === 'OTHER';

export const recipientNameRequired = (form, index) =>
  get(['associatedIncomes', index, 'recipientRelationship'], form) ===
    'CHILD' ||
  get(['associatedIncomes', index, 'recipientRelationship'], form) ===
    'PARENT' ||
  get(['associatedIncomes', index, 'recipientRelationship'], form) ===
    'CUSTODIAN' ||
  get(['associatedIncomes', index, 'recipientRelationship'], form) === 'OTHER';

export const showRecipientName = recipientRelationship =>
  recipientRelationship === 'CHILD' ||
  recipientRelationship === 'PARENT' ||
  recipientRelationship === 'CUSTODIAN' ||
  recipientRelationship === 'OTHER';
