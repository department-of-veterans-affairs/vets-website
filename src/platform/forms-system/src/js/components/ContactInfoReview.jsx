import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

// import { ADDRESS_TYPES } from '@department-of-veterans-affairs/platform-forms/exports';
// import { ADDRESS_TYPES } from 'platform/forms/address/helpers';
import { ADDRESS_TYPES } from '../../../../forms/address/helpers';

import {
  CONTACT_EDIT,
  renderTelephone,
  contactInfoPropTypes,
  validateEmail,
  validatePhone,
  validateZipcode,
} from '../utilities/data/profile';

/**
 * Contact info for review & submit page
 * @param {Object} data - form data
 * @param {function} editPage - edit page callback
 * @param {import('../utilities/data/profile').ContactInfoContent} content
 * @param {Object} keys - form data keys
 * @returns {Element}
 */
const ContactInfoReview = ({ data, editPage, content, keys }) => {
  const editRef = useRef(null);

  useEffect(
    () => {
      if (
        window.sessionStorage.getItem(CONTACT_EDIT) === 'true' &&
        editRef?.current
      ) {
        // focus on edit button _after_ editing and returning
        window.sessionStorage.removeItem(CONTACT_EDIT);
        setTimeout(() => focusElement(editRef.current));
      }
    },
    [editRef],
  );

  const dataWrap = data[keys.wrapper] || {};
  const email = dataWrap[keys.email] || '';
  const homePhone = dataWrap[keys.homePhone] || {};
  const mobilePhone = dataWrap[keys.mobilePhone] || {};
  const address = dataWrap[keys.address] || {};

  const isUS = address.addressType !== ADDRESS_TYPES.international;
  const stateOrProvince = isUS ? 'state' : 'province';

  const showValueOrErrorMessage = (value, errorMessage) =>
    (value || '').trim() ||
    (errorMessage && (
      <span className="usa-input-error-message">{errorMessage}</span>
    )) ||
    '';

  // Label: formatted value in (design) display order
  const display = [
    [
      content.homePhone,
      () => {
        if (!keys.homePhone) {
          return '';
        }
        const errorMsg = validatePhone(content, homePhone, 'homePhone');
        return errorMsg
          ? showValueOrErrorMessage('', errorMsg)
          : renderTelephone(homePhone);
      },
    ],
    [
      content.mobilePhone,
      () => {
        if (!keys.mobilePhone) {
          return '';
        }
        const errorMsg = validatePhone(content, mobilePhone, 'mobilePhone');
        return errorMsg
          ? showValueOrErrorMessage('', errorMsg)
          : renderTelephone(mobilePhone);
      },
    ],
    [
      content.email,
      () => {
        if (!keys.email) {
          return '';
        }
        const errorMsg = validateEmail(content, email);
        return showValueOrErrorMessage(errorMsg ? '' : email, errorMsg);
      },
    ],
    [
      content.country,
      () => {
        if (!keys.address) {
          return '';
        }
        return showValueOrErrorMessage(
          address.countryName,
          content.missingCountryError,
        );
      },
    ],
    [
      content.address1,
      () => {
        if (!keys.address) {
          return '';
        }
        return showValueOrErrorMessage(
          address.addressLine1,
          content.missingStreetAddressError,
        );
      },
    ],
    [content.address2, () => address.addressLine2],
    [content.address3, () => address.addressLine3],
    [
      content.city,
      () => {
        if (!keys.address) {
          return '';
        }
        return showValueOrErrorMessage(address.city, content.missingCityError);
      },
    ],
    [
      content[stateOrProvince],
      () => {
        if (!keys.address) {
          return '';
        }
        return isUS
          ? showValueOrErrorMessage(
              address.stateCode,
              content.missingStateOrProvinceError(isUS),
            )
          : '';
      },
    ],
    [
      isUS ? content.zipCode : content.postal,
      () => {
        if (!keys.address) {
          return '';
        }
        const code = address[isUS ? 'zipCode' : 'internationalPostalCode'];
        const errorMsg = isUS ? validateZipcode(content, code) : '';
        return showValueOrErrorMessage(errorMsg ? '' : code, errorMsg);
      },
    ],
  ];

  const handlers = {
    onEditPage: () => {
      // maintain state using session storage
      window.sessionStorage.setItem(CONTACT_EDIT, 'true');
      editPage();
    },
  };

  const list = display
    .map(([label, getValue], index) => {
      const value = getValue() || '';
      return value ? (
        <div key={label + index} className="review-row">
          <dt>{label}</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name={label}>
            {value}
          </dd>
        </div>
      ) : null;
    })
    .filter(Boolean);

  return (
    <div className="form-review-panel-page">
      <Element name="confirmContactInformationScrollElement" />
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {content.title}
        </h4>
        <button
          type="button"
          ref={editRef}
          id="confirmContactInformationEdit"
          className="edit-page usa-button-secondary"
          onClick={handlers.onEditPage}
          aria-label={content.editLabel}
        >
          {content.edit}
        </button>
      </div>
      {list.length ? <dl className="review">{list}</dl> : null}
    </div>
  );
};

ContactInfoReview.propTypes = {
  content: contactInfoPropTypes.content,
  data: contactInfoPropTypes.data,
  editPage: PropTypes.func,
  keys: contactInfoPropTypes.keys,
};

export default ContactInfoReview;
