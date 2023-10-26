import React from 'react';
import PropTypes from 'prop-types';
// import { formFields } from '../constants';

const ContactInformationReviewPanel = ({ data, editPage, title }) => {
  const EMAIL_ADDRESS = data?.email?.email ?? null;
  const PHONE_NUMBERS = data['view:phoneNumbers'];
  const MOBILE_PHONE = PHONE_NUMBERS?.mobilePhoneNumber?.phone ?? null;
  const HOME_PHONE = PHONE_NUMBERS?.phoneNumber?.phone ?? null;

  return (
    <>
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h4>
          <button
            aria-label={`Edit ${title}`}
            className="edit-btn primary-outline"
            onClick={editPage}
            type="button"
          >
            Edit
          </button>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Mobile phone number</dt>
            <dd>{MOBILE_PHONE}</dd>
          </div>
          <div className="review-row">
            <dt>Home phone number</dt>
            <dd>{HOME_PHONE}</dd>
          </div>
          <div className="review-row">
            <dt>Email</dt>
            <dd>{EMAIL_ADDRESS}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

ContactInformationReviewPanel.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  title: PropTypes.string,
};

export default ContactInformationReviewPanel;
