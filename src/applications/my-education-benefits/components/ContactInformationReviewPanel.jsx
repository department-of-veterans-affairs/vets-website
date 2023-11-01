import React from 'react';
import PropTypes from 'prop-types';

export function formatPhoneNumber(phoneNumber) {
  // Ensure we're dealing with a string of numbers.
  const cleanDigits = String(phoneNumber).replace(/\D/g, '');
  // Check if the phone number is not the correct length.
  if (cleanDigits.length !== 10) {
    // If it's not 10 digits, we don't want to format it,
    // just return the original number.
    return phoneNumber;
  }
  // At this point, we know the number is 10 digits long.
  // Extract the area code and prefix.
  const areaCode = cleanDigits.substring(0, 3);
  const prefix = cleanDigits.substring(3, 6);
  const line = cleanDigits.substring(6);
  // Format to the desired format.
  return `(${areaCode}) ${prefix}-${line}`;
}

const ContactInformationReviewPanel = ({ data, editPage, title }) => {
  const EMAIL_ADDRESS = data?.email?.email ?? null;
  const PHONE_NUMBERS = data['view:phoneNumbers'];
  const MOBILE_PHONE = PHONE_NUMBERS?.mobilePhoneNumber?.phone ?? null;
  const HOME_PHONE = PHONE_NUMBERS?.phoneNumber?.phone ?? null;

  const formattedMobilePhone = MOBILE_PHONE
    ? formatPhoneNumber(MOBILE_PHONE)
    : null;
  const formattedHomePhone = HOME_PHONE ? formatPhoneNumber(HOME_PHONE) : null;

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
            <dd>{formattedMobilePhone}</dd>
          </div>
          <div className="review-row">
            <dt>Home phone number</dt>
            <dd>{formattedHomePhone}</dd>
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
