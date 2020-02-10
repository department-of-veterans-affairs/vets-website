import _ from '../../../platform/utilities/data';
import { disabilityActionTypes, SERVICE_CONNECTION_TYPES } from './constants';

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

export function prefillTransformer(pages, formData, metadata) {
  const newData = formData;
  return {
    metadata,
    formData: newData,
    pages,
  };
}
