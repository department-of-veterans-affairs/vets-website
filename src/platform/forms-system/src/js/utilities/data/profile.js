import React from 'react';
import PropTypes from 'prop-types';

import {
  schemaCrossXRef,
  COUNTRY_NAMES,
  COUNTRY_VALUES,
  STREET_PATTERN,
} from '../../definitions/profileAddress';

/**
 * @typedef ContactInfoContent
 * @type {Object}
 * @property {String} address1 - review & submit address line 1 entry
 * @property {String} address2 - review & submit address line 2 entry
 * @property {String} address3 - review & submit address line 3 entry
 * @property {String} alertContent - successful updating all missing entries
 * @property {String} city - review & submit city entry
 * @property {String} country - review & submit country entry
 * @property {String|JSX} description - Contact info page description
 * @property {String} edit - Edit link text
 * @property {String} editEmail - Edit email page title
 * @property {String} editHomePhone - Edit home phone page title
 * @property {String} editLabel - Edit link aria-label
 * @property {String} editMailingAddress - Edit mailing address page title
 * @property {String} editMobilePhone - Edit mobile phone page title
 * @property {String} email - review & submit email entry
 * @property {String} homePhone - review & submit home phone entry
 * @property {String} mailingAddress - review & submit address
 * @property {String} missingAddress - address missing alert alert text
 * @property {String} missingEmail - email missing alert text
 * @property {String} missingEmailError - review & submit missing email error message
 * @property {String} missingHomeOrMobile - missing home phone alert text
 * @property {String} missingHomePhone - missing home phone alert text
 * @property {String} missingMobilePhone - missing mobile phone alert text
 * @property {String} mobilePhone - review & submit mobile phone entry
 * @property {String} postal - review & submit postal code entry
 * @property {String} province - review & submit province entry
 * @property {String} state - review & submit state entry
 * @property {String} title - Contact info page title
 * @property {String} update - Update button text (editing on review & submit)
 * @property {String} updated - Updated successful alert message
 */
/**
 * Get content for profile contact info pages
 * @param {String} appName - Include your named application, generic
 *  "application" or "request", etc
 * @returns {ContactInfoContent}
 */
export const getContent = (appName = 'application') => ({
  title: 'Contact information',
  description: (
    <>
      <p>
        This is the contact information we have on file for you. We’ll send any
        updates or information about your {appName} to this address.
      </p>
      <p>
        <strong>Note:</strong> Any updates you make here will be reflected in
        your VA.gov profile.
      </p>
    </>
  ),

  // page titles & link aria-labels
  editHomePhone: 'Edit home phone number',
  editMobilePhone: 'Edit mobile phone number',
  editEmail: 'Edit email address',
  editMailingAddress: 'Edit mailing address',

  edit: 'Edit', // link text
  editLabel: 'Edit contact information', // link aria-label
  update: 'Update page', // update button on review & submit page
  updated: 'updated', // alert updated text

  // Missing info alert messaging
  missingHomeOrMobile: 'home or mobile phone',
  missingHomePhone: 'home phone',
  missingMobilePhone: 'mobile phone',
  missingAddress: 'mailing address',
  missingEmail: 'email address',
  alertContent: `The missing information has been added to your ${appName}. You may continue.`,

  // review & submit & section titles
  mailingAddress: 'Mailing address',
  mobilePhone: 'Mobile phone number',
  homePhone: 'Home phone number',
  email: 'Email address',
  country: 'Country',
  address1: 'Street address',
  address2: 'Street address line 2',
  address3: 'Street address line 3',
  city: 'City',
  state: 'State',
  province: 'Province',
  postal: 'Postal code',

  // Error on review & submit
  missingEmailError: 'Missing email address',
});

export const CONTACT_INFO_PATH = 'contact-information';
export const CONTACT_EDIT = 'onReviewPageContactInfoEdit';
export const REVIEW_CONTACT = 'onReviewPageContactInfo';

/**
 * Blank schema
 */
export const blankSchema = { type: 'object', properties: {} };

/**
 * Phone schema
 */
export const standardPhoneSchema = isRequired => ({
  type: 'object',
  properties: {
    countryCode: {
      type: 'string',
      pattern: '^[0-9]+$',
      minLength: 1,
      maxLength: 3,
    },
    areaCode: {
      type: 'string',
      pattern: '^[0-9]{1,4}$',
      minLength: 1,
      maxLength: 4,
    },
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9]{1,14}$',
      minLength: 1,
      maxLength: 14,
    },
    phoneNumberExt: {
      type: 'string',
      pattern: '^[a-zA-Z0-9]{1,10}$',
      minLength: 1,
      maxLength: 10,
    },
  },
  required: isRequired ? ['areaCode', 'phoneNumber'] : [],
});

/**
 * Email schema
 */
export const standardEmailSchema = {
  type: 'string',
  format: 'email',
  minLength: 6,
  maxLength: 255,
};

/**
 * Address schema
 */
export const standardAddressSchema = isRequired => ({
  type: 'object',
  required: isRequired
    ? [
        schemaCrossXRef.country,
        schemaCrossXRef.street,
        schemaCrossXRef.city,
        schemaCrossXRef.postalCode,
      ]
    : [],
  properties: {
    [schemaCrossXRef.isMilitary]: {
      type: 'boolean',
    },
    [schemaCrossXRef.country]: {
      type: 'string',
      enum: COUNTRY_VALUES,
      enumNames: COUNTRY_NAMES,
    },
    [schemaCrossXRef.street]: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: STREET_PATTERN,
    },
    [schemaCrossXRef.street2]: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: STREET_PATTERN,
    },
    [schemaCrossXRef.street3]: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: STREET_PATTERN,
    },
    [schemaCrossXRef.city]: {
      type: 'string',
    },
    [schemaCrossXRef.state]: {
      type: 'string',
    },
    [schemaCrossXRef.postalCode]: {
      type: 'string',
    },
  },
});

/**
 * @typedef phoneObject
 * @type {Object}
 * @property {String} countryCode - country code (1 digit, usually)
 * @property {String} areaCode - area code (3 digits)
 * @property {String} phoneNumber - phone number (7 digits)
 * @property {String} phoneNumberExt - extension
 * @returns
 */
/**
 * Combine area code and phone number in a string
 * @param {phoneObject} phone
 * @returns {String} area code + phone number
 */
export const getPhoneString = (phone = {}) =>
  `${phone?.areaCode || ''}${phone?.phoneNumber || ''}`;

export const renderTelephone = (phone = {}) => {
  const phoneString = getPhoneString(phone);
  return phoneString ? (
    <va-telephone contact={phoneString} not-clickable />
  ) : null;
};

/**
 * @typedef ContactInfoKeys
 * @type {Object}
 * @property {String} wrapper=veteran - object key wrapping the contact info
 * @property {String} email=email - object key containing the email string
 * @property {String} homePhone=homePhone - object key containing home phone object
 * @property {String} mobilePhone=mobilePhone - object key containing mobile phone object
 * @property {String} address=mailingAddress - object key containing address data
 */
/**
 * Get a list of missing contact info; this list is used within the alerts
 * Only include required fields
 * @param {Object} data - data inside wrapper (formData.veteran by default)
 * @param {ContactInfoKeys} keys - contact info keys
 * @param {ContactInfoContent} content - content for alert
 * @param {String[]} requiredKeys - list of required contact info keys
 * @returns {Array} - array of keys with missing data
 */
export const getMissingInfo = ({ data, keys, content, requiredKeys = [] }) => {
  const missingInfo = [];
  // If both home & mobile selected, make only one phone required
  const phones = [keys.homePhone, '|', keys.mobilePhone];
  const eitherPhone =
    requiredKeys.includes(phones.join('')) ||
    requiredKeys.includes(phones.reverse().join(''));

  if (keys.homePhone && keys.mobilePhone && eitherPhone) {
    missingInfo.push(
      data[keys.homePhone]?.phoneNumber || data[keys.mobilePhone]?.phoneNumber
        ? ''
        : content.missingHomeOrMobile,
    );
  } else {
    // If only one phone is used, make it required
    if (keys.homePhone && requiredKeys.includes(keys.homePhone)) {
      missingInfo.push(
        data[keys.homePhone]?.phoneNumber ? '' : content.missingHomePhone,
      );
    }
    if (keys.mobilePhone && requiredKeys.includes(keys.mobilePhone)) {
      missingInfo.push(
        data[keys.mobilePhone]?.phoneNumber ? '' : content.missingMobilePhone,
      );
    }
  }
  if (keys.email && requiredKeys.includes(keys.email)) {
    missingInfo.push(data[keys.email] ? '' : content.missingEmail);
  }
  if (keys.address && requiredKeys.includes(keys.address)) {
    missingInfo.push(
      data[keys.address]?.addressLine1 ? '' : content.missingAddress,
    );
  }
  return missingInfo.filter(Boolean);
};

/**
 * Set sessionStorage of last edited contact field. We could have used
 * selectMostRecentlyUpdatedField from the VAP service instead of using
 * sessionStorage, but we wouldn't know if the edit was canceled
 * @param {string} key - ID of contact info input
 * @param {string} state - either "updated" or "canceled"
 */
export const setReturnState = (key = '', state = '') =>
  window.sessionStorage.setItem(CONTACT_EDIT, `${key},${state}`);
/**
 * Get ID and state of last edited contact field so we know where to move focus
 * @returns {Array} Array with ID at index zero, and state at index one
 */
export const getReturnState = () =>
  window.sessionStorage.getItem(CONTACT_EDIT) || '';
export const clearReturnState = () =>
  window.sessionStorage.removeItem(CONTACT_EDIT);

export const contactInfoPropTypes = {
  content: PropTypes.shape({
    address1: PropTypes.string, // review & submit address line 1 entry
    address2: PropTypes.string, // review & submit address line 2 entry
    address3: PropTypes.string, // review & submit address line 3 entry
    alertContent: PropTypes.string, // successful updating all missing entries
    city: PropTypes.string, // review & submit city entry
    country: PropTypes.string, // review & submit country entry
    // Contact info page description
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    edit: PropTypes.string, // Edit link text
    editEmail: PropTypes.string, // Edit email page title
    editHomePhone: PropTypes.string, // Edit home phone page title
    editLabel: PropTypes.string, // Edit link aria-label
    editMailingAddress: PropTypes.string, // Edit mailing address page title
    editMobilePhone: PropTypes.string, // Edit mobile phone page title
    email: PropTypes.string, // review & submit email entry
    homePhone: PropTypes.string, // review & submit home phone entry
    mailingAddress: PropTypes.string, // review & submit address
    missingAddress: PropTypes.string, // address missing alert alert text
    missingEmail: PropTypes.string, // email missing alert text
    missingEmailError: PropTypes.string, // review & submit missing email error message
    missingHomeOrMobile: PropTypes.string, // missing home phone alert text
    missingHomePhone: PropTypes.string, // missing home phone alert text
    missingMobilePhone: PropTypes.string, // missing mobile phone alert text
    mobilePhone: PropTypes.string, // review & submit mobile phone entry
    postal: PropTypes.string, // review & submit postal code entry
    province: PropTypes.string, // review & submit province entry
    state: PropTypes.string, // review & submit state entry
    title: PropTypes.string, // Contact info page title
    update: PropTypes.string, // Update button text (editing on review & submit)
    updated: PropTypes.string, // Updated successful alert message
  }),
  keys: PropTypes.shape({
    wrapper: PropTypes.string,
    homePhone: PropTypes.string,
    mobilePhone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
  }),
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      email: PropTypes.string,
      homePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      mobilePhone: PropTypes.shape({
        countryCode: PropTypes.string,
        areaCode: PropTypes.string,
        phoneNumber: PropTypes.string,
        extension: PropTypes.string,
      }),
      mailingAddress: PropTypes.shape({
        addressLine1: PropTypes.string,
        addressLine2: PropTypes.string,
        addressLine3: PropTypes.string,
        addressType: PropTypes.string,
        city: PropTypes.string,
        countryName: PropTypes.string,
        internationalPostalCode: PropTypes.string,
        province: PropTypes.string,
        stateCode: PropTypes.string,
        zipCode: PropTypes.string,
      }),
    }),
  }),
};
