import _ from 'platform/utilities/data';
import {
  SERVICE_CONNECTION_TYPES,
  disabilityActionTypes,
  MILITARY_CITIES,
} from './constants';
import { viewifyFields } from './utils';
import { migrateBranches } from './utils/serviceBranches';

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

export default function prefillTransformer(pages, formData, metadata, state) {
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
      const { emailAddress, primaryPhone, mailingAddress } = veteran;
      newData.phoneAndEmail = {};
      if (emailAddress) {
        newData.phoneAndEmail.emailAddress = emailAddress;
      }
      if (primaryPhone) {
        newData.phoneAndEmail.primaryPhone = primaryPhone;
      }
      if (mailingAddress) {
        const onMilitaryBase = MILITARY_CITIES.includes(mailingAddress.city);
        newData.mailingAddress = {
          // strip out any extra data. Maybe left over from v1?
          // see https://github.com/department-of-veterans-affairs/va.gov-team/issues/19423
          'view:livesOnMilitaryBase': onMilitaryBase,
          country: mailingAddress.country || '',
          addressLine1: mailingAddress.addressLine1 || '',
          addressLine2: mailingAddress.addressLine2,
          addressLine3: mailingAddress.addressLine3,
          city: mailingAddress.city || '',
          state: mailingAddress.state || '',
          zipCode: mailingAddress.zipCode || '',
        };
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
    // backend is prefilling with older branch names
    return migrateBranches(newData);
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

  const prefillStartedFormVersion = data => {
    const newData = _.omit(['startedFormVersion'], data);
    const { startedFormVersion } = data;

    if (startedFormVersion) {
      newData.startedFormVersion = startedFormVersion;
    }

    return newData;
  };

  const prefillSyncModern0781Flow = data => {
    const newData = _.omit(['syncModern0781Flow'], data);
    const { syncModern0781Flow } = data;

    if (syncModern0781Flow) {
      newData.syncModern0781Flow = syncModern0781Flow;
    }

    return newData;
  };

  const prefillDisabilityCompNewConditionsWorkflow = data => {
    const newData = _.omit(['disabilityCompNewConditionsWorkflow'], data);
    const { disabilityCompNewConditionsWorkflow } = data;

    if (disabilityCompNewConditionsWorkflow) {
      newData.disabilityCompNewConditionsWorkflow = disabilityCompNewConditionsWorkflow;
    }

    return newData;
  };

  const transformations = [
    prefillRatedDisabilities,
    prefillContactInformation,
    prefillServiceInformation,
    prefillBankInformation,
    prefillStartedFormVersion,
    prefillSyncModern0781Flow,
    prefillDisabilityCompNewConditionsWorkflow,
  ];

  const applyTransformations = (data = {}, transformer) =>
    transformer(data, state);

  return {
    metadata,
    formData: transformations.reduce(applyTransformations, formData),
    pages,
  };
}
