import _ from '../../../platform/utilities/data';
import { SERVICE_CONNECTION_TYPES, disabilityActionTypes } from './constants';
import { viewifyFields } from './utils';

export const filterServiceConnected = (disabilities = []) =>
  disabilities.filter(
    d => d.decisionCode === SERVICE_CONNECTION_TYPES.serviceConnected,
  );

export const addNoneDisabilityActionType = (disabilities = []) =>
  disabilities.map(d =>
    _.set('disabilityActionType', disabilityActionTypes.NONE, d),
  );

export default function prefillTransformer(pages, form, metadata) {
  const prefillRatedDisabilities = formData => {
    const newFormData = _.omit(['disabilities'], formData);
    const { disabilities } = formData;
    if (disabilities) {
      newFormData.ratedDisabilities = addNoneDisabilityActionType(
        filterServiceConnected(disabilities),
      );
    }

    return newFormData;
  };

  const prefillContactInformation = formData => {
    const newFormData = _.omit(['veteran'], formData);
    const { veteran } = formData;

    if (veteran) {
      const { emailAddress, primaryPhone, mailingAddress } = veteran;
      newFormData.phoneAndEmail = {};
      if (emailAddress) {
        newFormData.phoneAndEmail.emailAddress = emailAddress;
      }
      if (primaryPhone) {
        newFormData.phoneAndEmail.primaryPhone = primaryPhone;
      }
      if (mailingAddress) {
        newFormData.mailingAddress = mailingAddress;
      }
    }

    return newFormData;
  };

  const prefillServiceInformation = formData => {
    const newFormData = _.omit(
      ['servicePeriods', 'reservesNationalGuardService'],
      formData,
    );
    const { servicePeriods, reservesNationalGuardService } = formData;
    if (servicePeriods || reservesNationalGuardService) {
      newFormData.serviceInformation = {};
      if (servicePeriods) {
        newFormData.serviceInformation.servicePeriods = servicePeriods;
      }
      if (reservesNationalGuardService) {
        newFormData.serviceInformation.reservesNationalGuardService = reservesNationalGuardService;
      }
    }

    return newFormData;
  };

  const prefillBankInformation = formData => {
    const newFormData = _.omit(
      ['bankAccountType', 'bankAccountNumber', 'bankRoutingNumber', 'bankName'],
      formData,
    );

    const {
      bankAccountType,
      bankAccountNumber,
      bankRoutingNumber,
      bankName,
    } = formData;

    if (bankAccountType && bankAccountNumber && bankRoutingNumber && bankName) {
      newFormData['view:originalBankAccount'] = viewifyFields({
        bankAccountType,
        bankAccountNumber,
        bankRoutingNumber,
        bankName,
      });

      // start the bank widget in 'review' mode
      newFormData['view:bankAccount'] = { 'view:hasPrefilledBank': true };
    }

    return newFormData;
  };

  const transformations = [
    prefillRatedDisabilities,
    prefillContactInformation,
    prefillServiceInformation,
    prefillBankInformation,
  ];

  const applyTransformations = (data, transformer) => transformer(data);

  return {
    metadata,
    formData: transformations.reduce(applyTransformations, form),
    pages,
  };
}
