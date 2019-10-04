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
    } else if (!state && city) {
      address = `${city}`;
    } else if (state && !city) {
      address = `${state}`;
    }
  } else if (country) {
    if (city) {
      address = `${city}, ${country}`;
    } else {
      address = `${country}`;
    }
  }
  return address;
};
