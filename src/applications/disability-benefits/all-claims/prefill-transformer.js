import _ from 'platform/utilities/data';
import { SERVICE_CONNECTION_TYPES, disabilityActionTypes } from './constants';
import { viewifyFields } from './utils';

// ****************************************
// This entire file _may_ be obsolete once form 526EZ v1 is no longer supported
// Update: 7/2020 - v1 removed; but leaving this code in place a little longer
// since I don't know the impact of completely removing it will have; and
// leaving it in place doesn't hurt anything
// ****************************************
export const filterServiceConnected = (disabilities = []) =>
  disabilities.filter(
    d => d.decisionCode === SERVICE_CONNECTION_TYPES.serviceConnected,
  );

export const addNoneDisabilityActionType = (disabilities = []) =>
  disabilities.map(d =>
    _.set('disabilityActionType', disabilityActionTypes.NONE, d),
  );

export const setClaimTypeNewOnly = formData =>
  _.set(
    ['view:claimType'],
    {
      'view:claimingNew': true,
      'view:claimingIncrease': false,
    },
    formData,
  );

export default function prefillTransformer(pages, formData, metadata) {
  const prefillRatedDisabilities = data => {
    const { disabilities } = data;

    if (!disabilities) {
      return setClaimTypeNewOnly(data);
    }

    const transformedDisabilities = addNoneDisabilityActionType(
      filterServiceConnected(disabilities),
    );

    const newData = _.omit(['disabilities'], data);

    return transformedDisabilities.length
      ? _.set('ratedDisabilities', transformedDisabilities, newData)
      : setClaimTypeNewOnly(newData);
  };

  const prefillContactInformation = data => {
    const newData = _.omit(['veteran'], data);
    const { veteran } = data;

    if (veteran) {
      // Form 526 v1 data; transform into v2 format
      // This transform already includes the attachments data (list of uploaded
      // documents)
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
