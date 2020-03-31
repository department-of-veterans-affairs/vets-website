import {
  countries,
  states,
} from 'platform/forms-system/src/js/utilities/address';

export const FETCH_VETERAN_INFORMATION =
  'disability-benefits/2346/FETCH_VETERAN_INFORMATION';
export const FETCH_VETERAN_INFORMATION_FAILURE =
  'disability-benefits/2346/FETCH_VETERAN_INFORMATION_FAILURE';
export const FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION =
  'disability-benefits/2346/FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION';
export const FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION_FAILURE =
  'disability-benefits/2346/FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION_FAILURE';

export const PERM_ADDRESS_SELECTED_SUCCESSFUL =
  'disability-benefits/2346/PERM_ADDRESS_SELECTED_SUCCESSFUL';

export const PERM_ADDRESS_SELECTED_FAILURE =
  'disability-benefits/2346/PERM_ADDRESS_SELECTED_FAILURE';

export const TEMP_ADDRESS_SELECTED_SUCCESSFUL =
  'disability-benefits/2346/TEMP_ADDRESS_SELECTED_SUCCESSFUL';

export const TEMP_ADDRESS_SELECTED_FAILURE =
  'disability-benefits/2346/TEMP_ADDRESS_SELECTED_FAILURE';

export const PERM_ADDRESS_MILITARY_BASE_SELECTED =
  'disability-benefits/2346/PERM_ADDRESS_MILITARY_BASE_SELECTED';

export const PERM_ADDRESS_MILITARY_BASE_DESELECTED =
  'disability-benefits/2346/PERM_ADDRESS_MILITARY_BASE_DESELECTED';

export const PERM_ADDRESS_MILITARY_BASE_SELECTION_FAILURE =
  'disability-benefits/2346/PERM_ADDRESS_MILITARY_BASE_FAILURE';

export const TEMP_ADDRESS_MILITARY_BASE_SELECTED =
  'disability-benefits/2346/TEMP_ADDRESS_MILITARY_BASE_SELECTED';

export const TEMP_ADDRESS_MILITARY_BASE_DESELECTED =
  'disability-benefits/2346/TEMP_ADDRESS_MILITARY_BASE_DESELECTED';

export const TEMP_ADDRESS_MILITARY_BASE_SELECTION_FAILURE =
  'disability-benefits/2346/TEMP_ADDRESS_MILITARY_BASE_FAILURE';

export const schemaFields = {
  permAddressField: 'permanentAddress',
  tempAddressField: 'temporaryAddress',
  emailField: 'email',
  suppliesField: 'supplies',
  viewAddBatteriesField: 'view:AddBatteries',
  viewAddAccessoriesField: 'view:AddAccessories',
};

export const countryValues = countries.map(object => object.value);
export const countryNames = countries.map(object => object.label);

export const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);
export const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);
export const militaryCities = ['APO', 'DPO', 'FPO'];
export const usaStates = states.USA.map(state => state.value);
export const usaLabels = states.USA.map(state => state.label);
export const canProvinces = states.CAN.map(state => state.value);
export const canLabels = states.CAN.map(state => state.label);
export const mexStates = states.MEX.map(state => state.value);
export const mexLabels = states.MEX.map(state => state.label);

export const USA = 'USA';
export const CAN = 'CAN';
export const MEX = 'MEX';
