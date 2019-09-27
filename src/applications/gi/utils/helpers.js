export const formatNumber = value => {
  const str = (+value).toString();
  return `${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
};

export const formatCurrency = value => `$${formatNumber(Math.round(+value))}`;

export const isVetTecSelected = filters =>
  filters.category === 'vettec' || filters.vetTecProvider;

export const addAllOption = options => [
  { value: 'ALL', label: 'ALL' },
  ...options,
];

export const locationInfo = (city, state, country) => {
  let address = '';
  if (country === 'USA') {
    if (city && state) {
      address = `${city}, ${state}`;
    } else if (!state) {
      address = `${city}`;
    } else if (!city) {
      address = `${state}`;
    }
  } else if (country) {
    if (city && country) {
      address = `${city}, ${country}`;
    } else if (!city) {
      address = `${country}`;
    } else {
      address = `${city}`;
    }
  }
  return address;
};

export const schoolLocationTableInfo = (city, state, country, zip) => {
  let address = locationInfo(city, state, country);
  if (country === 'USA' && zip) {
    address = `${address} ${zip}`;
  }
  return address;
};
