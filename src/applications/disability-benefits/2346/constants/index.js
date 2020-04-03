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
  useThisAddressField: 'useThisAddress',
};

export const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);

export const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);

export const militaryCities = ['APO', 'DPO', 'FPO'];
export const countryValues = countries.map(object => object.value);
export const countryNames = countries.map(object => object.label);
export const usaStates = states.USA.map(state => state.value);
export const usaLabels = states.USA.map(state => state.label);
export const canProvinces = states.CAN.map(state => state.value);
export const canLabels = states.CAN.map(state => state.label);
export const mexStates = states.MEX.map(state => state.value);
export const mexLabels = states.MEX.map(state => state.label);
export const USA = 'USA';
export const CAN = 'CAN';
export const MEX = 'MEX';
export const states50AndDC = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District Of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

export const HEARING_AID_ACCESSORIES = 'hearing aid accessories';
export const HEARING_AID_BATTERIES = 'hearing aid batteries';
export const BLUE_BACKGROUND =
  'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px';
export const WHITE_BACKGROUND =
  'vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px';
