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

function formatDiplomaDate(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getUTCFullYear();
  const month = `0${dateObj.getMonth() + 1}`.slice(-2);
  const day = `0${dateObj.getDate()}`.slice(-2);
  return `${month}/${day}/${year}`;
}

const ApplicantInformationReviewPage = ({
  data,
  dateOfBirth,
  editPage,
  title,
  userFullName,
}) => {
  const formattedDateOfBirth = formatDateString(dateOfBirth);
  const formattedDiplomaDate = formatDiplomaDate(data?.highSchoolDiplomaDate);

  return (
    <div className="form-review-panel-page">
      {/* Title and Button on the Same Line */}
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        {data?.highSchoolDiploma && (
          <va-button
            uswds
            aria-label={`Edit ${title}`}
            secondary
            text="Edit"
            onClick={editPage}
          />
        )}
      </div>

      <p className="va-address-block">
        {userFullName.first} {userFullName.middle} {userFullName.last}
        <br />
        Date of birth: {formattedDateOfBirth}
      </p>

      <dl className="review">
        {/* Parent / Guardian Signature */}
        {data?.parentGuardianSponsor && (
          <div className="review-row">
            <dt>Parent / Guardian Signature:</dt>
            <dd>{data.parentGuardianSponsor}</dd>
          </div>
        )}

        {/* High School Information */}
        {data?.toeHighSchoolInfoChange && (
          <>
            {data?.highSchoolDiploma && (
              <div className="review-row">
                <dt>
                  Did you earn a high school diploma or equivalency certificate?
                </dt>
                <dd>{data?.highSchoolDiploma}</dd>
              </div>
            )}
            {data?.highSchoolDiplomaDate && (
              <div className="review-row">
                <dt>
                  When did you earn your high school diploma or equivalency
                  certificate?
                </dt>
                <dd>{formattedDiplomaDate}</dd>
              </div>
            )}
          </>
        )}
      </dl>
    </div>
  );
};

ApplicantInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  dateOfBirth: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userFullName: PropTypes.shape({
    first: PropTypes.string.isRequired,
    middle: PropTypes.string,
    last: PropTypes.string.isRequired,
  }).isRequired,
  editPage: PropTypes.func,
};

const mapStateToProps = state => ({
  userFullName: state.user.profile?.userFullName,
  dateOfBirth: state.user.profile?.dob,
});

export default connect(mapStateToProps)(ApplicantInformationReviewPage);
