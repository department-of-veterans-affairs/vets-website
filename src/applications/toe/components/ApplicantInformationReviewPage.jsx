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
    <>
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h4>
          {!data.showMebEnhancements06 && (
            <button
              aria-label={`Edit ${title}`}
              className="edit-btn primary-outline"
              onClick={editPage}
              type="button"
            >
              Edit
            </button>
          )}
        </div>
        {data.showMebEnhancements06 ? (
          <p className="va-address-block">
            {userFullName.first} {userFullName.middle} {userFullName.last}
            <br />
            Date of birth: {formattedDateOfBirth}
          </p>
        ) : (
          <dl className="review">
            <div className="review-row">
              <dt>Full Name</dt>
              <dd>
                {data['view:userFullName'].userFullName.first}{' '}
                {data['view:userFullName'].userFullName.middle}{' '}
                {data['view:userFullName'].userFullName.last}{' '}
              </dd>
            </div>
            <div className="review-row">
              <dt>Date of birth</dt>
              <dd>{data.dateOfBirth}</dd>
            </div>
          </dl>
        )}

        {data?.toeHighSchoolInfoChange && (
          <dl className="review">
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

            {data?.highSchoolDiploma && (
              <button
                aria-label={`Edit ${title}`}
                className="edit-btn primary-outline"
                onClick={editPage}
                type="button"
              >
                Edit
              </button>
            )}
          </dl>
        )}
      </div>
    </>
  );
};

ApplicantInformationReviewPage.propTypes = {
  data: PropTypes.object,
  dateOfBirth: PropTypes.string,
  editPage: PropTypes.func,
  title: PropTypes.string,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  userFullName: state.user.profile?.userFullName,
  dateOfBirth: state.user.profile?.dob,
});

export default connect(mapStateToProps)(ApplicantInformationReviewPage);
