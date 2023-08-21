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

  // Label: formatted value in (design) display order
  const display = [
    [content.homePhone, () => renderTelephone(homePhone)],
    [content.mobilePhone, () => renderTelephone(mobilePhone)],
    [
      content.email,
      () =>
        email || (
          <span className="usa-input-error-message">
            {content.missingEmailError}
          </span>
        ),
    ],
    [content.country, () => address.countryName],
    [content.address1, () => address.addressLine1],
    [content.address2, () => address.addressLine2],
    [content.address3, () => address.addressLine3],
    [content.city, () => address.city],
    [content[stateOrProvince], () => address[isUS ? 'stateCode' : 'province']],
    [
      content.postal,
      () => address[isUS ? 'zipCode' : 'internationalPostalCode'],
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
          <dd className="dd-privacy-hidden">{value}</dd>
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
