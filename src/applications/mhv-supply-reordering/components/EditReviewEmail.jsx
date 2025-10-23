import React from 'react';
import PropTypes from 'prop-types';

const EditReviewEmail = ({ formData, defaultEditButton, title }) => (
  <div className="form-review-panel-page">
    <div name="editEmailAddressScrollElement" />
    <div className="form-review-panel-page-header-row">
      <h4 className="form-review-panel-page-header vads-u-font-size--h5">
        {title}
      </h4>
      {defaultEditButton({ label: `Edit ${title}` })}
    </div>
    <div className="vads-u-margin-top--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
      <div className="vads-u-padding-y--2 vads-u-border-top--1px vads-u-border-color--gray-light">
        {formData.emailAddress || ''}
      </div>
    </div>
  </div>
);

EditReviewEmail.propTypes = {
  defaultEditButton: PropTypes.func,
  formData: PropTypes.shape({
    emailAddress: PropTypes.string,
  }),
  title: PropTypes.string,
};

export default EditReviewEmail;
