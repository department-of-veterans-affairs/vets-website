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

const PersonalInformationReviewField = ({
  data,
  dateOfBirth,
  editPage,
  title,
  userFullName,
}) => {
  const formattedDateOfBirth = formatDateString(dateOfBirth);
  const formattedGraduationDate = formatDateString(data?.graduationDate);
  return (
    <>
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <va-button
            aria-label={`Edit ${title}`}
            secondary
            text="Edit"
            onClick={editPage}
          />
        </div>

        <dl className="review">
          <div className="review-row">
            <p className="va-address-block">
              {userFullName?.first} {userFullName?.middle} {userFullName?.last}
              <br />
              Date of birth: {formattedDateOfBirth}
            </p>
          </div>
          <div className="review-row">
            <dt>Did you earn a high school or equivalency certificate?</dt>
            <dd>{data?.highSchoolDiploma}</dd>
          </div>

          {data?.highSchoolDiploma === 'yes' && (
            <div className="review-row">
              <dt>
                When did you earn a high school or equivalency certificate?
              </dt>
              <dd>{formattedGraduationDate}</dd>
            </div>
          )}
        </dl>
      </div>
    </>
  );
};

PersonalInformationReviewField.propTypes = {
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

export default connect(mapStateToProps)(PersonalInformationReviewField);
