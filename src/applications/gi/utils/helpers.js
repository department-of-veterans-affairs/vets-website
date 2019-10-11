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

export const isCountryUSA = country => country.toUpperCase() === 'USA';
export const isCountryInternational = country => !isCountryUSA(country);

export const locationInfo = (city, state, country) => {
  let address = '';
  if (isCountryUSA(country)) {
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

export const websiteInfo = website => {
  let providerWebsite = '';
  if (website) {
    providerWebsite = website;
  }
  return providerWebsite;
};

export const phoneInfo = (areaCode, phoneNumber) => {
  let providerPhone = '';
  if (areaCode && phoneNumber) {
    providerPhone = `${areaCode}-${phoneNumber}`;
  }
  return providerPhone;
};

export const localeInfo = locale => {
  let providerLocale = '';
  if (locale) {
    providerLocale = locale;
  }
  return providerLocale;
};
