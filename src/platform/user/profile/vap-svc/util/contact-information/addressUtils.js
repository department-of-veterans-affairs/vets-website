import pickBy from 'lodash/pickBy';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import {
  FIELD_NAMES,
  USA,
  ADDRESS_FORM_VALUES,
  ADDRESS_TYPES,
  ADDRESS_POU,
} from '../../constants';
import * as VAP_SERVICE from '../../constants';

const inferAddressType = (countryCodeIso3, stateCode) => {
  let addressType = ADDRESS_TYPES.DOMESTIC;
  if (countryCodeIso3 !== USA.COUNTRY_ISO3_CODE) {
    addressType = ADDRESS_TYPES.INTERNATIONAL;
  } else if (ADDRESS_FORM_VALUES.MILITARY_STATES.has(stateCode)) {
    addressType = ADDRESS_TYPES.OVERSEAS_MILITARY;
  }

  return addressType;
};

const addressConvertNextValueToCleanData = value => {
  const {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    city,
    countryCodeIso3,
    stateCode,
    zipCode,
    internationalPostalCode,
    province,
    'view:livesOnMilitaryBase': livesOnMilitaryBase,
  } = value;

  const addressType = inferAddressType(countryCodeIso3, stateCode);

  return {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    addressType,
    city,
    countryCodeIso3: livesOnMilitaryBase
      ? USA.COUNTRY_ISO3_CODE
      : countryCodeIso3,
    province: addressType === ADDRESS_TYPES.INTERNATIONAL ? province : null,
    stateCode: addressType === ADDRESS_TYPES.INTERNATIONAL ? null : stateCode,
    zipCode: addressType !== ADDRESS_TYPES.INTERNATIONAL ? zipCode : null,
    internationalPostalCode:
      addressType === ADDRESS_TYPES.INTERNATIONAL
        ? internationalPostalCode
        : null,
    'view:livesOnMilitaryBase': livesOnMilitaryBase,
  };
};

export const addressConvertCleanDataToPayload = (data, fieldName) => {
  const cleanData = addressConvertNextValueToCleanData(data);
  return pickBy(
    {
      id: cleanData.id,
      addressLine1: cleanData.addressLine1,
      addressLine2: cleanData.addressLine2,
      addressLine3: cleanData.addressLine3,
      addressType: cleanData.addressType,
      city: cleanData.city,
      countryCodeIso3: cleanData.countryCodeIso3,
      stateCode: cleanData.stateCode,
      internationalPostalCode: cleanData.internationalPostalCode,
      zipCode: cleanData.zipCode,
      province: cleanData.province,
      addressPou:
        fieldName === FIELD_NAMES.MAILING_ADDRESS
          ? ADDRESS_POU.CORRESPONDENCE
          : ADDRESS_POU.RESIDENCE,
    },
    e => !!e,
  );
};

export const formatAddressTitle = title => title.replace('address', '').trim();

export const getErrorsFromDom = () => $$('.usa-input-error-message');

export const handleUpdateButtonClick = (
  queryForErrors,
  fieldName,
  recordCustomProfileEvent,
) => {
  const errors = queryForErrors();

  // only gather analytics if there are inline validation errors and if the field is an address
  const shouldReportErrors =
    [FIELD_NAMES.RESIDENTIAL_ADDRESS, FIELD_NAMES.MAILING_ADDRESS].includes(
      fieldName,
    ) && errors.length > 0;

  if (shouldReportErrors) {
    const title = VAP_SERVICE.FIELD_TITLES[fieldName];

    const payload = {
      title: `Address Validation Errors - ${title}`,
      status: `Error Count - ${errors.length}`,
    };

    recordCustomProfileEvent(payload);
  }
};
