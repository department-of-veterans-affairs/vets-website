import React from 'react';
import PropTypes from 'prop-types';

import {
  getFormattedPhone,
  getPhoneString,
  hasHomeAndMobilePhone,
} from '../utils/contactInfo';
import { PRIMARY_PHONE, errorMessages } from '../constants';
import { content } from '../content/primaryPhone';

const PrimaryPhoneReview = ({ data, editPage }) => {
  const primary = data[PRIMARY_PHONE] || '';
  const phone = data.veteran[`${primary}Phone`] || '';
  const label = content[`${primary}Label`] || '';
  const error =
    getPhoneString(phone).trim() === '' || label === '' ? (
      <strong className="usa-input-error-message">
        {errorMessages.missingPrimaryPhone}
      </strong>
    ) : null;
  const labelWrapClasses = error
    ? 'vads-u-border-left--4px vads-u-border-color--secondary-dark vads-u-padding-left--1p5'
    : '';
  return hasHomeAndMobilePhone(data) ? (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {content.reviewTitle}
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={editPage}
          label={content.editLabel}
          text={content.edit}
          uswds
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt className={labelWrapClasses}>{error || label}</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="primary phone">
            <strong>{error ? '' : getFormattedPhone(phone)}</strong>
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
};

PrimaryPhoneReview.propTypes = {
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      homePhone: PropTypes.shape({}),
      mobilePhone: PropTypes.shape({}),
    }),
    [PRIMARY_PHONE]: PropTypes.string,
  }),
  editPage: PropTypes.func,
};

export default PrimaryPhoneReview;
