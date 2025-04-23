import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function formatDiplomaDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return '';
  const [year, month, day] = dateString?.split('-');
  return `${month}/${day}/${year}`;
}

const PersonalInformationReviewField = ({
  data,
  dateOfBirth,
  editPage,
  title,
  userFullName,
}) => {
  const formattedDateOfBirth = formatDiplomaDate(dateOfBirth);
  const formattedGraduationDate = formatDiplomaDate(data?.graduationDate);
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
            <dt>
              Did you earn a high school diploma or equivalency certificate?
            </dt>
            <dd>{data?.highSchoolDiploma}</dd>
          </div>

          {data?.highSchoolDiploma === 'yes' && (
            <div className="review-row">
              <dt>
                When did you earn a high school diploma or equivalency
                certificate?
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
