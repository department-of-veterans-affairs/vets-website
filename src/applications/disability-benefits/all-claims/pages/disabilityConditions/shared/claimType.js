import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { ARRAY_PATH, NEW_CONDITION_OPTION } from '../../../constants';

export const computeClaimTypeFromItems = (items = []) => ({
  'view:claimingNew': items.some(
    item => item?.ratedDisability === NEW_CONDITION_OPTION,
  ),
  'view:claimingIncrease': items.some(item => {
    const v = item?.ratedDisability;
    return v && v !== NEW_CONDITION_OPTION;
  }),
});

export const updateClaimTypeFromArray = (_oldData, newData) => {
  const items = get(ARRAY_PATH, newData);
  if (!Array.isArray(items)) return newData;

  const next = computeClaimTypeFromItems(items);
  const curr = newData?.['view:claimType'];

  const same =
    curr?.['view:claimingNew'] === next['view:claimingNew'] &&
    curr?.['view:claimingIncrease'] === next['view:claimingIncrease'];

  return same ? newData : set('view:claimType', next, newData);
};
