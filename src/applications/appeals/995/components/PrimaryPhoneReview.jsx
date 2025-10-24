import React from 'react';
import PropTypes from 'prop-types';

import {
  getFormattedPhone,
  getPhoneString,
  hasHomeAndMobilePhone,
} from '../../shared/utils/contactInfo';
import { PRIMARY_PHONE, errorMessages } from '../constants';
import { content } from '../content/primaryPhone';
import { data995 } from '../../shared/props';

const PrimaryPhoneReview = ({ data, editPage }) => {
  const primary = data[PRIMARY_PHONE] || '';
  const phone = data.veteran[`${primary}Phone`] || '';
  const label = content[`${primary}Label`] || '';
  const error =
    getPhoneString(phone).trim() === '' || label === '' ? (
      <strong className="usa-input-error-message">
        {errorMessages.missingPrimaryPhoneReview}
      </strong>
    ) : null;

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
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{label || 'Primary phone number'}</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="primary phone">
            {error ?? <strong>{getFormattedPhone(phone)}</strong>}
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
};

PrimaryPhoneReview.propTypes = {
  data: PropTypes.shape(data995),
  editPage: PropTypes.func,
};

export default PrimaryPhoneReview;
