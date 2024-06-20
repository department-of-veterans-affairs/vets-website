/**
 * The intent for this module is to provide a flexible, reusable address schema and widget that can be used in any form throughout VA.gov.
 * The address uiSchema should be flexible enough to handle these cases:
 * 1. Top level address property (schema.properties.address)
 * 2. Nested address property (schema.properties.someProperty.properties.address)
 * 3. Array items.
 *
 * Fields that may depend on external variables to make the form required:
 * 1. Country - could depend on things like: yes/no field, checkbox in a different form chapter, etc.
 * 2. Address Line 1 - same as country
 * 3. City - same as country
 *
 * Fields that are required based on internal field variables:
 * 1. State - required if the country is the United States OR US Military Address
 * 2. Zipcode - required if the country is the United States OR US Military Address
 * 3. International Postal Code - required if the country is NOT the United States OR US Military address
 *
 * Fields that are optional:
 * 1. State/Province/Region - shows up if the country is NOT the US, but NOT required.
 */

import React from 'react';
import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import constants from 'vets-json-schema/dist/constants.json';
import { isValidZipcode } from 'platform/forms/validations';

/**
 * CONSTANTS:
 * 1. MILITARY_STATES - object of military state codes and names.
 * 2. USA - used to just reference the United States
 * 3. MilitaryBaseInfo - expandable text to expound on military base addresses.
 * 4. addressSchema - data model for address schema.
 */

// filtered States that include US territories
const filteredStates = constants.states.USA.filter(
  state => !ADDRESS_DATA.militaryStates.includes(state.value),
);

const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

const USA = {
  value: 'USA',
  label: 'United States',
};

const MilitaryBaseInfo = () => (
  <div className="vads-u-padding-x--2p5">
    <va-additional-info
      trigger="Learn more about military base addresses"
      uswds="false"
    >
      <span>
        Addresses on U.S. military bases are considered domestic addresses, even
        when the military base is in another country. When you check this box,
        we automatically choose the United States as the country.
      </span>
    </va-additional-info>
  </div>
);

const MILITARY_BASE_PATH = 'view:livesOnMilitaryBase';
const MILITARY_BASE_INFO_PATH = `${MILITARY_BASE_PATH}Info`;

/**
 * Builds address schema based on isMilitaryAddress.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 * @returns {object} an object containing the necessary properties for a domestic US address, foreign US military address, and international address.
 */
export const buildAddressSchema = isMilitaryBaseAddress => {
  const addSchema = fullSchema.definitions.addressSchema;
  if (isMilitaryBaseAddress) return cloneDeep(addSchema);
  const schema = cloneDeep(addSchema);
  delete schema.properties[MILITARY_BASE_PATH];
  delete schema.properties[MILITARY_BASE_INFO_PATH];
  return schema;
};

const insertArrayIndex = (key, index) => key.replace('[INDEX]', `[${index}]`);

const getOldFormDataPath = (path, index) => {
  const indexToSlice = index !== null ? path.indexOf(index) + 1 : 0;
  return path.slice(indexToSlice);
};

const MILITARY_BASE_ZIP_REGEX = {
  AA: '^3{1}4{1}0{1}[0-9]{2}',
  AE: '^0{1}9{1}[0-9]{3}',
  AP: '^9{1}6{1}[2-6]{1}[0-9]{2}',
};

export const DOMESTIC_BASE_ERROR =
  'This postal code is within the United States. If your mailing address is in the United States, uncheck the checkbox “I receive mail outside of the United States on a U.S. military base.” If your mailing address is an AFO/FPO/DPO address, enter the postal code for the military base.';
export const INVALID_ZIP_ERROR =
  'Your address is on a military base outside of the United States. Please provide an APO/FPO/DPO postal code.';

export const validateZipCode = (zipCode, stateCode, errors) => {
  if (stateCode in MILITARY_BASE_ZIP_REGEX) {
    if (!zipCode.match(MILITARY_BASE_ZIP_REGEX[stateCode])) {
      errors.addError(INVALID_ZIP_ERROR);
      return false;
    }
  } else if (isValidZipcode(zipCode)) {
    const isDomesticZipCode = !Object.values(MILITARY_BASE_ZIP_REGEX).some(
      regex => zipCode.match(regex),
    );
    if (isDomesticZipCode) {
      errors.addError(DOMESTIC_BASE_ERROR);
      return false;
    }
  }
  return true;
};

// Temporary storage for city & state if military base checkbox is toggled more
// than once. Not ideal, but works since this code isn't inside a React widget
const savedAddress = {
  city: '',
  stateCode: '',
};

/**
 * Update form data to remove selected military city & state and restore any
 * previously set city & state when the "I live on a U.S. military base"
 * checkbox is unchecked. See va.gov-team/issues/42216 for details
 * @param {object} oldFormData - Form data prior to interaction change
 * @param {object} formData - Form data after interaction change
 * @param {array} path - path to address in form data
 * @param {number} index - index, if form data array of addresses; also included
 *  in the path, but added here to make it easier to distinguish between
 *  addresses not in an array with addresses inside an array
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormDataAddress = (
  oldFormData,
  formData,
  path,
  index = null, // this is included in the path, but added as
) => {
  let updatedData = formData;

  /*
   * formData and oldFormData are not guaranteed to have the same shape; formData
   * will always return the entire data object. See below for details on oldFormData
   *
   * In the src/platform/forms-system/src/js/containers/FormPage.jsx, if the
   * address is inside an array (has a `showPagePerItem` index), oldData is set
   * to the form data from the array index (see the this.formData() function)
   * but that may not include the address object, so we're passing in a path as
   * an array and using `getOldFormDataPath` to find the appropriate path
   */
  const oldAddress = get(getOldFormDataPath(path, index), oldFormData, {});

  const address = get(path, formData, {});
  const onMilitaryBase = address?.[MILITARY_BASE_PATH];
  let { city, stateCode } = address;

  if (oldAddress?.[MILITARY_BASE_PATH] !== onMilitaryBase) {
    if (onMilitaryBase) {
      savedAddress.city = oldAddress.city || '';
      savedAddress.stateCode = oldAddress.stateCode || '';
      city = '';
      stateCode = '';
    } else {
      city = ADDRESS_DATA.militaryCities.includes(oldAddress.city)
        ? savedAddress.city
        : city || savedAddress.city;
      stateCode = ADDRESS_DATA.militaryStates.includes(oldAddress.stateCode)
        ? savedAddress.stateCode
        : stateCode || savedAddress.stateCode;
    }
    updatedData = set([...path, 'city'], city, updatedData);
    updatedData = set([...path, 'stateCode'], stateCode, updatedData);
  }

  return updatedData;
};

/**
 * This method takes a list of parameters and generates an addressUiSchema.
 * @param {function} callback slots into the 'ui:required' for the necessary fields.
 * @param {string} path represents the path to the address in formData.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 */

export const addressUISchema = (
  isMilitaryBaseAddress = false,
  path,
  callback,
) => {
  // As mentioned above, there are certain fields that depend on the values of other fields when using updateSchema, replaceSchema, and hideIf.
  // The two constants below are paths used to retrieve the values in those other fields.
  const livesOnMilitaryBasePath = `${path}[${MILITARY_BASE_PATH}]`;
  const alternativeLivesOnMilitaryBasePath = MILITARY_BASE_PATH;
  const checkBoxTitleState = path.includes('veteran') ? 'I' : 'They';

  return (function returnAddressUI() {
    return {
      [MILITARY_BASE_PATH]: {
        'ui:title': `${checkBoxTitleState} receive mail outside of the United States on a U.S. military base.`,
        'ui:options': {
          hideIf: () => !isMilitaryBaseAddress,
          hideEmptyValueInReview: true,
        },
      },
      [MILITARY_BASE_INFO_PATH]: {
        'ui:description': MilitaryBaseInfo,
        'ui:options': {
          hideIf: () => !isMilitaryBaseAddress,
          hideEmptyValueInReview: true,
        },
      },
      countryName: {
        'ui:required': callback,
        'ui:title': 'Country',
        'ui:autocomplete': 'country',
        'ui:options': {
          updateSchema: (formData, schema, uiSchema, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryPath = path;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryPath = insertArrayIndex(path, index);
            }
            const countryUI = uiSchema;
            const countryFormData = get(countryPath, formData);
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              countryUI['ui:disabled'] = true;
              countryFormData.countryName = USA.value;
              return {
                enum: [USA.value],
                enumNames: [USA.label],
                default: USA.value,
              };
            }
            countryUI['ui:disabled'] = false;
            return {
              type: 'string',
              enum: constants.countries.map(country => country.value),
              enumNames: constants.countries.map(country => country.label),
            };
          },
        },
      },
      addressLine1: {
        'ui:required': callback,
        'ui:title': 'Street address',
        'ui:autocomplete': 'address-line1',
        'ui:errorMessages': {
          required: 'Street address is required',
          pattern: 'Street address must be 35 characters or less',
        },
        'ui:options': {
          updateSchema: (formData, schema) => {
            return Object.assign(schema, {
              maxLength: 35,
            });
          },
        },
      },
      addressLine2: {
        'ui:title': 'Street address line 2',
        'ui:autocomplete': 'address-line2',
        'ui:errorMessages': {
          pattern: 'Street address line 2 must be 35 characters or less',
        },
        'ui:options': {
          hideEmptyValueInReview: true,
          updateSchema: (formData, schema) => {
            return Object.assign(schema, {
              maxLength: 35,
            });
          },
        },
      },
      addressLine3: {
        'ui:title': 'Street address line 3',
        'ui:autocomplete': 'address-line3',
        'ui:errorMessages': {
          pattern: 'Street address line 3 must be 35 characters or less',
        },
        'ui:options': {
          hideEmptyValueInReview: true,
          updateSchema: (formData, schema) => {
            return Object.assign(schema, {
              maxLength: 35,
            });
          },
        },
      },
      city: {
        'ui:required': callback,
        'ui:autocomplete': 'address-level2',
        'ui:errorMessages': {
          required: 'City is required',
          pattern: 'City must be 30 characters or less',
        },
        'ui:validations': [
          (errors, city, formData, _schema, _uiSchema, _index) => {
            // This variable represents whether a veteran checked the "I live on a military base outside of the U.S." checkbox on the page
            // running this validation. This is stored within `formData` as `view:livesOnMilitaryBase` (`MILITARY_BASE_PATH`), but the path
            // thereto differs depending on the page running the validation.
            let livesOnMilitaryBase =
              // This is the relevant path for most pages and their corresponding panels on the 'review and submit' page.
              get(livesOnMilitaryBasePath, formData) ||
              // This is the path for the `reportStepchildNotInHousehold.stepchildInformation` page. We can't use `livesOnMilitaryBasePath`
              // -- which uses the `path` passed into `addressUISchema` (`stepChildren[INDEX].address`) -- because on this "per item" page,
              // `formData` is actually the data for a particular stepChild, instead of the complete `formData` object.
              // See https://github.com/department-of-veterans-affairs/vets-website/blob/8a6967285d2fcce22372f309066b52a982afaa6e/src/platform/forms-system/src/js/containers/FormPage.jsx#L56.
              get(`address[${MILITARY_BASE_PATH}]`, formData) ||
              // This is the path for `addChild.addChildInformation` page, another "per item" page that must be handled similarly to the
              // `reportStepchildNotInHousehold.stepchildInformation` page above.
              get(`childAddressInfo.address[${MILITARY_BASE_PATH}]`, formData);

            // We need to isolate the following validations to the review-and-submit page because they are designed to operate on the complete
            // formData object. If these validations were run on, say, the `studentAddressMarriageTuition` page, they would fail to raise a
            // validation error on `studentAddressMarriageTuition` page, if either of the `some` checks below returned `true`. All this
            // headache could be avoided if `_index` above wasn't null.
            if (window.location.href.includes('review-and-submit')) {
              livesOnMilitaryBase =
                livesOnMilitaryBase ||
                // This is the path for each stepChild in the `reportStepchildNotInHousehold.stepchildInformation` page's corresponding panel
                // on the 'review and submit' page. We can't use `livesOnMilitaryBasePath` -- which uses the `path` passed into `addressUISchema`
                // (`stepChildren[INDEX].address`) -- because `_index` above is `null`. Without an `index`, we are unable to replace `INDEX` using
                // `insertArrayIndex` as is done in the `countryName` field. The absence of an index, unless intentional, may be a longstanding
                // platform bug. To work around this issue, `some` is used below.
                (formData.stepChildren || []).some(stepChild =>
                  get(`address[${MILITARY_BASE_PATH}]`, stepChild),
                ) ||
                // Same story here, but for each child in the `addChild.addChildInformation` page's corresponding panel on the 'review and submit'
                // page.
                (formData.childrenToAdd || []).some(stepChild =>
                  get(
                    `childAddressInfo.address[${MILITARY_BASE_PATH}]`,
                    stepChild,
                  ),
                );
            }

            if (
              // The 'I live on a United States military base outside of the U.S. checkbox is only visible if `isMilitaryBaseAddress` is `true`.
              isMilitaryBaseAddress &&
              ['APO', 'FPO', 'DPO'].includes(city?.toUpperCase()) &&
              !livesOnMilitaryBase
            ) {
              // This error is necessary to prevent veterans from sending bad data to BIS (formerly, BGS). Without it, veterans would list a
              // city of APO/FPO/DPO with a US State code (e.g. FL), instead of a Military State code (e.g. AA), which would result in a BIS
              // error and a failed Form 686c submission. Veterans would also list a military base address (e.g. APO AE) with a foreign
              // country (e.g. Libya), instead of "United States." This, too, would result in a BIS error and a failed Form 686c submission.
              // Adding the following error forces the veteran to send a correctly formatted address to BIS. Unfortunately, it also presents
              // an accessibility issue where, upon checking the checkbox referenced by the error, the newly appeared APO/FPO/DPO dropdown
              // shows the error: "Select a valid option," without describing which field is errored. A similar issue is described here:
              // https://github.com/department-of-veterans-affairs/va.gov-team/issues/16784 (a platform-wide issue), and the means to its
              // resolution is described here: https://github.com/department-of-veterans-affairs/va.gov-team/issues/5577 (a platform-wide
              // solution). Alternatively, an update could be made to the form system validation code. See
              // `src/platform/forms-system/src/js/validation.js` (`defaultMessages.enum`). There are no reasonable workarounds that I am
              // aware of.
              errors.addError(
                `For ${city} addresses, check the "${checkBoxTitleState} receive mail outside of the United States on a U.S. military base" checkbox. If you live on a military base in the United States, enter your city.`,
              );
            }
          },
        ],
        'ui:options': {
          replaceSchema: (formData, schema, uiSchema, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return {
                type: 'string',
                title: 'APO/FPO/DPO',
                enum: constants.militaryCities.map(city => city.value),
                enumNames: constants.militaryCities.map(city => city.label),
              };
            }
            return {
              type: 'string',
              title: 'City',
              minLength: 1,
              maxLength: 30,
              pattern: '^.*\\S.*',
            };
          },
        },
      },
      stateCode: {
        'ui:required': (formData, index) => {
          let countryNamePath = `${path}.countryName`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
          const countryName = get(countryNamePath, formData);
          return (
            (countryName && countryName === USA.value) || livesOnMilitaryBase
          );
        },
        'ui:title': 'State',
        'ui:autocomplete': 'address-level1',
        'ui:errorMessages': {
          required: 'State is required',
        },
        'ui:options': {
          hideIf: (formData, index) => {
            // Because we have to update countryName manually in formData above,
            // We have to check this when a user selects a non-US country and then selects
            // the military base checkbox.
            let countryNamePath = `${path}.countryName`;
            let militaryBasePath = livesOnMilitaryBasePath;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return false;
            }
            const countryName = get(countryNamePath, formData);
            return countryName && countryName !== USA.value;
          },
          updateSchema: (formData, schema, uiSchema, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return {
                enum: Object.keys(MILITARY_STATES),
                enumNames: Object.values(MILITARY_STATES),
              };
            }
            return {
              enum: filteredStates.map(state => state.value),
              enumNames: filteredStates.map(state => state.label),
            };
          },
        },
      },
      province: {
        'ui:title': 'State/Province/Region',
        'ui:autocomplete': 'address-level1',
        'ui:options': {
          hideEmptyValueInReview: true,
          hideIf: (formData, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryNamePath = `${path}.countryName`;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return true;
            }
            const countryName = get(countryNamePath, formData);
            return countryName === USA.value || !countryName;
          },
        },
      },
      zipCode: {
        'ui:autocomplete': 'postal-code',
        'ui:required': (formData, index) => {
          let militaryBasePath = livesOnMilitaryBasePath;
          let countryNamePath = `${path}.countryName`;

          if (typeof index === 'number') {
            militaryBasePath = insertArrayIndex(livesOnMilitaryBasePath, index);
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const livesOnMilitaryBase = get(militaryBasePath, formData);
          const countryName = get(countryNamePath, formData);

          return (
            (countryName && countryName === USA.value) ||
            (isMilitaryBaseAddress && livesOnMilitaryBase)
          );
        },
        'ui:title': 'Postal Code',
        'ui:validations': [
          (errors, zipCode, formData, _schema, _uiSchema, index) => {
            // consider splitting on "[INDEX]." and taking the second string as path when index is null
            let address;
            if (typeof index === 'number') {
              const addressPath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              address = get(addressPath, formData);
            } else if (
              path === 'childrenToAdd[INDEX].childAddressInfo.address'
            ) {
              address = get('childAddressInfo.address', formData);
            } else if (path === 'stepChildren[INDEX].address') {
              address = get('address', formData);
            } else {
              address = get(path, formData);
            }
            const livesOnMilitaryBase =
              address?.[alternativeLivesOnMilitaryBasePath];
            if (!address || !livesOnMilitaryBase) {
              // if (!address) console.log("no address!");
              return true;
            }

            return validateZipCode(zipCode, address.stateCode, errors);
          },
        ],
        'ui:errorMessages': {
          required: 'Postal code is required',
          pattern: 'Postal code must be 5 digits',
        },
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
          hideIf: (formData, index) => {
            // Because we have to update countryName manually in formData above,
            // We have to check this when a user selects a non-US country and then selects
            // the military base checkbox.
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryNamePath = `${path}.countryName`;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            const countryName = get(countryNamePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return false;
            }
            return countryName && countryName !== USA.value;
          },
        },
      },
      internationalPostalCode: {
        'ui:required': (formData, index) => {
          let countryNamePath = `${path}.countryName`;
          if (typeof index === 'number') {
            countryNamePath = insertArrayIndex(countryNamePath, index);
          }
          const countryName = get(countryNamePath, formData);
          return countryName && countryName !== USA.value;
        },
        'ui:title': 'International postal code',
        'ui:errorMessages': {
          required: 'International postal code is required',
        },
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
          hideIf: (formData, index) => {
            let militaryBasePath = livesOnMilitaryBasePath;
            let countryNamePath = `${path}.countryName`;
            if (typeof index === 'number') {
              militaryBasePath = insertArrayIndex(
                livesOnMilitaryBasePath,
                index,
              );
              countryNamePath = insertArrayIndex(countryNamePath, index);
            }
            const livesOnMilitaryBase = get(militaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return true;
            }
            const countryName = get(countryNamePath, formData);
            return countryName === USA.value || !countryName;
          },
        },
      },
    };
  })();
};
