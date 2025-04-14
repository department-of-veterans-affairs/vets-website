import get from 'platform/utilities/data/get';

export const annualReceivedIncomeFromAnnuityRequired = (form, index) =>
  get(['annuities', index, 'receivingIncomeFromAnnuity'], form);

export const annualReceivedIncomeFromTrustRequired = (form, index) =>
  get(['trusts', index, 'receivingIncomeFromTrust'], form);

export const formatCurrency = num => `$${num.toLocaleString()}`;

export const isDefined = value => value !== '' && typeof value !== 'undefined';

export const monthlyMedicalReimbursementAmountRequired = (form, index) =>
  get(['trusts', index, 'monthlyMedicalReimbursementAmount'], form);

export const otherAssetOwnerRelationshipExplanationRequired = (form, index) =>
  get(['unreportedAssets', index, 'assetOwnerRelationship'], form) === 'OTHER';

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

export const otherNewOwnerRelationshipExplanationRequired = (form, index) =>
  get(['assetTransfers', index, 'originalOwnerRelationship'], form) === 'OTHER';

export const otherTransferMethodExplanationRequired = (form, index) =>
  get(['assetTransfers', index, 'transferMethod'], form) === 'OTHER';

export const recipientNameRequired = (form, index, arrayKey) =>
  get([arrayKey, index, 'recipientRelationship'], form) === 'CHILD' ||
  get([arrayKey, index, 'recipientRelationship'], form) === 'PARENT' ||
  get([arrayKey, index, 'recipientRelationship'], form) === 'CUSTODIAN' ||
  get([arrayKey, index, 'recipientRelationship'], form) === 'OTHER';

export const surrenderValueRequired = (form, index) =>
  get(['annuities', index, 'canBeLiquidated'], form);
