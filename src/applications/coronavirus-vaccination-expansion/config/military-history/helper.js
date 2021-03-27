import {
  branchesServed,
  dischargeTypes,
} from 'platform/static-data/options-for-select';

export const serviceBranchLabels = () => {
  return branchesServed.map(branch => {
    return branch.label;
  });
};
export const dischargeTypeLabels = () => {
  return dischargeTypes.map(type => {
    return type.label;
  });
};
