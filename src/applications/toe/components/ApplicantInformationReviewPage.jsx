import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function ordinalSuffix(num) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = num % 100;
  return (
    num + (suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0])
  );
}
function formatDateString(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  const day = ordinalSuffix(dateObj.getUTCDate());
  return `${month} ${day}, ${year}`;
}
const ApplicantInformationReviewPage = ({
  dateOfBirth,
  title,
  userFullName,
}) => {
  const formattedDateOfBirth = formatDateString(dateOfBirth);
  return (
    <>
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h4>
        </div>
        <p className="va-address-block">
          {userFullName.first} {userFullName.middle} {userFullName.last}
          <br />
          Date of birth: {formattedDateOfBirth}
        </p>
      </div>
    </>
  );
};
ApplicantInformationReviewPage.propTypes = {
  dateOfBirth: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userFullName: PropTypes.shape({
    first: PropTypes.string.isRequired,
    middle: PropTypes.string,
    last: PropTypes.string.isRequired,
  }).isRequired,
};
const mapStateToProps = state => ({
  userFullName: state.user.profile?.userFullName,
  dateOfBirth: state.user.profile?.dob,
});
export default connect(mapStateToProps)(ApplicantInformationReviewPage);
