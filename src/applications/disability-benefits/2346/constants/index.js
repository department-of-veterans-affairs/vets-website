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

export const MILITARY_STATE_LABELS = [
  'Armed Forces Americas (AA)',
  'Armed Forces Europe (AE)',
  'Armed Forces Pacific (AP)',
];

export const MILITARY_CITIES = ['APO', 'DPO', 'FPO'];
export const MILITARY_STATE_VALUES = ['AA', 'AE', 'AP'];
export const PCIU_STATES = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'American Samoa', value: 'AS' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'Armed Forces Americas (AA)', value: 'AA' },
  { label: 'Armed Forces Europe (AE)', value: 'AE' },
  { label: 'Armed Forces Pacific (AP)', value: 'AP' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District Of Columbia', value: 'DC' },
  { label: 'Federated States Of Micronesia', value: 'FM' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Guam', value: 'GU' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Marshall Islands', value: 'MH' },
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
  { label: 'Northern Mariana Islands', value: 'MP' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Palau', value: 'PW' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Philippine Islands', value: 'PI' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'U.S. Minor Outlying Islands', value: 'UM' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virgin Islands', value: 'VI' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];
export const STATE_VALUES = PCIU_STATES.map(state => state.value);
export const STATE_LABELS = PCIU_STATES.map(state => state.label);

export const USA = 'USA';
