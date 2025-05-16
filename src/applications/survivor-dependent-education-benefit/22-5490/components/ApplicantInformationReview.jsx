import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate, formatReadableDate } from '../helpers';

const ApplicantInformationReview = ({ data, editPage }) => {
  const relationshipToMember = data?.relationshipToMember;
  const fullName = data?.fullName || {};
  const dateOfBirth = data?.dateOfBirth;
  const ssn = data?.ssn;

  let relationshipDisplay = 'Not provided';
  if (relationshipToMember === 'spouse') {
    relationshipDisplay = 'Spouse';
  } else if (relationshipToMember === 'child') {
    relationshipDisplay = 'Child';
  }

  return (
    <div className="form-review-panel-page">
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Review Veteran or Service Member Information
        </h4>
        <va-button
          aria-label="Edit Veteran or Service Member Information"
          secondary
          text="Edit"
          onClick={editPage}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Relationship to service member</dt>
          <dd>{relationshipDisplay}</dd>
        </div>
        <div className="review-row">
          <dt>Veteran or service member’s name</dt>
          <dd>
            {`${fullName.first || ''} ${fullName.middle ||
              ''} ${fullName.last || ''}`.trim() || 'Not provided'}
          </dd>
        </div>
        <div className="review-row">
          <dt>Date of birth</dt>
          <dd>
            {dateOfBirth ? formatReadableDate(dateOfBirth) : 'Not provided'}
          </dd>
        </div>
        <div className="review-row">
          <dt>Social Security number</dt>
          <dd>{ssn ? obfuscate(ssn) : 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

ApplicantInformationReview.propTypes = {
  editPage: PropTypes.func.isRequired,
  data: PropTypes.shape({
    relationshipToMember: PropTypes.string,
    fullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
    }),
    dateOfBirth: PropTypes.string,
    ssn: PropTypes.string,
  }),
};

// Ensure data prop is provided, even if it's an empty object, if not required by parent
ApplicantInformationReview.defaultProps = {
  data: {},
};

export default ApplicantInformationReview;
