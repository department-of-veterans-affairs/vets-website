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

export default function prefillTransformer(pages, formData, metadata) {
  const prefillRatedDisabilities = data => {
    const newData = _.omit(['disabilities'], data);
    const { disabilities } = data;
    if (disabilities) {
      newData.ratedDisabilities = addNoneDisabilityActionType(
        filterServiceConnected(disabilities),
      );
    }

    return newData;
  };

  const prefillContactInformation = data => {
    const newData = _.omit(['veteran'], data);
    const { veteran } = data;

    if (veteran) {
      const { emailAddress, primaryPhone, mailingAddress } = veteran;
      newData.phoneAndEmail = {};
      if (emailAddress) {
        newData.phoneAndEmail.emailAddress = emailAddress;
      }
      if (primaryPhone) {
        newData.phoneAndEmail.primaryPhone = primaryPhone;
      }
      if (mailingAddress) {
        newData.mailingAddress = mailingAddress;
      }
    }

    return newData;
  };

  const prefillServiceInformation = data => {
    const newData = _.omit(
      ['servicePeriods', 'reservesNationalGuardService'],
      data,
    );
    const { servicePeriods, reservesNationalGuardService } = data;
    if (servicePeriods || reservesNationalGuardService) {
      newData.serviceInformation = {};
      if (servicePeriods) {
        newData.serviceInformation.servicePeriods = servicePeriods;
      }
      if (reservesNationalGuardService) {
        newData.serviceInformation.reservesNationalGuardService = reservesNationalGuardService;
      }
    }

    return newData;
  };

  const prefillBankInformation = data => {
    const newData = _.omit(
      ['bankAccountType', 'bankAccountNumber', 'bankRoutingNumber', 'bankName'],
      data,
    );

    const {
      bankAccountType,
      bankAccountNumber,
      bankRoutingNumber,
      bankName,
    } = data;

    if (bankAccountType && bankAccountNumber && bankRoutingNumber && bankName) {
      newData['view:originalBankAccount'] = viewifyFields({
        bankAccountType,
        bankAccountNumber,
        bankRoutingNumber,
        bankName,
      });

      // start the bank widget in 'review' mode
      newData['view:bankAccount'] = { 'view:hasPrefilledBank': true };
    }

    return newData;
  };

  const transformations = [
    prefillRatedDisabilities,
    prefillContactInformation,
    prefillServiceInformation,
    prefillBankInformation,
  ];

  const applyTransformations = (data = {}, transformer) => transformer(data);

  return {
    metadata,
    formData: transformations.reduce(applyTransformations, formData),
    pages,
  };
}
