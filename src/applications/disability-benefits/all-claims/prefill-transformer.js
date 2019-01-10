import _ from '../../../platform/utilities/data';
import { SERVICE_CONNECTION_TYPES, disabilityActionTypes } from './constants';
import { viewifyFields } from './utils';

// Only service-connected disabilities should be included in the form
export const filterServiceConnected = (disabilities = []) =>
  disabilities.filter(
    d => d.decisionCode === SERVICE_CONNECTION_TYPES.serviceConnected,
  );

// Add 'NONE' disabilityActionType to each rated disability because it's
// required in the schema
export const addNoneDisabilityActionType = (disabilities = []) =>
  disabilities.map(d =>
    _.set('disabilityActionType', disabilityActionTypes.NONE, d),
  );

export function transformMVPData(formData) {
  const newFormData = _.omit(
    ['veteran', 'servicePeriods', 'reservesNationalGuardService'],
    formData,
  );

  // Put phone and email prefill into the right place
  const { veteran } = formData;
  if (veteran) {
    newFormData.phoneAndEmail = {};
    if (veteran.emailAddress) {
      newFormData.phoneAndEmail.emailAddress = veteran.emailAddress;
    }
    if (veteran.primaryPhone) {
      newFormData.phoneAndEmail.primaryPhone = veteran.primaryPhone;
    }
  }

  // Nest servicePeriods and reservesNationalGuardService under serviceInformation
  //  without creating a serviceInformation property unnecessarily
  const { servicePeriods, reservesNationalGuardService } = formData;
  if (servicePeriods || reservesNationalGuardService) {
    newFormData.serviceInformation = {
      ..._.get('serviceInformation', newFormData, {}),
      servicePeriods,
      reservesNationalGuardService,
    };
  }

  return newFormData;
}

export function prefillTransformer(pages, formData, metadata) {
  // Define transformer functions
  const newFormData = transformMVPData(formData);
  const { disabilities } = newFormData;

  // SiP automatically removes empty properties from prefill
  if (disabilities) {
    newFormData.ratedDisabilities = addNoneDisabilityActionType(
      filterServiceConnected(disabilities),
    );

    delete newFormData.disabilities;
  }

  // Pre-fill hidden bank info for use in the PaymentView
  const bankAccount = {
    bankAccountType: newFormData.bankAccountType,
    bankAccountNumber: newFormData.bankAccountNumber,
    bankRoutingNumber: newFormData.bankRoutingNumber,
    bankName: newFormData.bankName,
  };
  newFormData['view:originalBankAccount'] = viewifyFields(bankAccount);

  // Let the payment info card start in review mode if we have pre-filled bank information
  if (
    Object.values(newFormData['view:originalBankAccount']).some(
      value => !!value,
    )
  ) {
    newFormData['view:bankAccount'] = {
      'view:hasPrefilledBank': true,
    };
  }

  // Remove bank fields since they're already in view:originalBankAccount
  delete newFormData.bankAccountType;
  delete newFormData.bankAccountNumber;
  delete newFormData.bankRoutingNumber;
  delete newFormData.bankName;

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}
