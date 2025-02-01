import React from 'react';
import PropTypes from 'prop-types';
import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';

const EditReviewAddress = ({ formData, defaultEditButton, title }) => (
  <div className="form-review-panel-page">
    <div name="editMailingAddressScrollElement" />
    <div className="form-review-panel-page-header-row">
      <h4 className="form-review-panel-page-header vads-u-font-size--h5">
        {title}
      </h4>
      <div className="vads-u-justify-content--flex-end">
        {defaultEditButton({ label: `Edit ${title}` })}
      </div>
    </div>
    <div className="vads-u-margin-top--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
      <div className="vads-u-padding-y--2 vads-u-border-top--1px vads-u-border-color--gray-light">
        <AddressViewField formData={formData.permanentAddress} />
      </div>
    </div>
    <div />
  </div>
);

EditReviewAddress.propTypes = {
  defaultEditButton: PropTypes.func,
  formData: PropTypes.shape({
    permanentAddress: PropTypes.object,
  }),
  title: PropTypes.string,
};

export default EditReviewAddress;
