import React from 'react';
import PropTypes from 'prop-types';
import { isValidCurrency } from '../validation';
import { isHomeAcreageMoreThanTwo, formatCurrency } from '../helpers';

export const content = {
  label: 'What’s the value of the land that’s more than 2 acres?',
  error: 'Please enter a valid dollar amount',
  title: 'Home acreage value',
  edit: 'Edit',
};

const HomeAcreageValueReview = ({ data, editPage }) => {
  const { homeAcreageValue = '' } = data;
  const error =
    homeAcreageValue !== '' && !isValidCurrency(homeAcreageValue) ? (
      <strong className="usa-input-error-message">{content.error}</strong>
    ) : null;
  const labelWrapClasses = error
    ? 'vads-u-border-left--4px vads-u-border-color--secondary-dark vads-u-padding-left--1p5'
    : '';

  return isHomeAcreageMoreThanTwo(data) ? (
    <div className="form-review-panel-page vads-u-margin-bottom--7">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {content.title}
        </h4>
        <va-button
          secondary
          class="edit-page float-right"
          onClick={editPage}
          label={content.edit}
          text={content.edit}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt className={labelWrapClasses}>{error || content.label}</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="home acreage value"
          >
            <strong>{error ? '' : formatCurrency(homeAcreageValue)}</strong>
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
};

HomeAcreageValueReview.propTypes = {
  data: PropTypes.shape({
    homeAcreageValue: PropTypes.number,
  }),
  editPage: PropTypes.func,
};

export default HomeAcreageValueReview;
