import countries from './config/countries.json';

export const ADDRESS_TYPES = {
  domestic: 'DOMESTIC',
  international: 'INTERNATIONAL',
  military: 'OVERSEAS MILITARY',
};

export function formatAddress(address) {
  /* eslint-disable prefer-template */

  const {
    country,
    postalCode,
    state,
    street,
    street2,
    addressLine1,
    addressLine2,
    addressLine3,
    addressMetaData,
    city,
    internationalPostalCode,
    stateProvince,
    zipCode5,
  } = address || {};

  let cityStateZip = '';

  const displayCountry = countries.find(
    countryCode =>
      countryCode.countryCodeISO3 === country?.iso3Code ||
      countryCode.countryCodeISO3 === country,
  );

  const displayCountryName = displayCountry?.countryName;
  const zip = postalCode || zipCode5;

  // Only show country when ADDRESS_TYPES.international
  const addressCountry =
    addressMetaData?.addressType === ADDRESS_TYPES.international
      ? country.name || displayCountryName
      : '';

  const addressStreet = street
    ? `${street} ${street2}`
    : `${addressLine1} ${addressLine2} ${addressLine3}`;

  // only use the full state name for military addresses, otherwise just show
  // the two-letter state code
  let stateName = state || stateProvince?.code;
  if (addressMetaData?.addressType === ADDRESS_TYPES.military) {
    stateName = stateProvince.name;
  }

  switch (addressMetaData?.addressType) {
    case ADDRESS_TYPES.domestic:
    case ADDRESS_TYPES.military:
      cityStateZip = city || '';
      if (city && stateProvince?.code) cityStateZip += ', ';
      if (stateProvince?.code) cityStateZip += stateName;
      if (zipCode5) cityStateZip += ' ' + zipCode5;
      break;

    // For international addresses we add a comma after the province
    case ADDRESS_TYPES.international:
      cityStateZip =
        [city, stateProvince.name, internationalPostalCode]
          .filter(item => item)
          .join(', ') || '';
      break;

    default:
      cityStateZip = `${city} ${stateName} ${zip}` || '';
  }

  return { addressStreet, cityStateZip, addressCountry };
}

export function getFileSize(num) {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${Math.floor(num / 1000)} KB`;
  }
  return `${num} B`;
}
