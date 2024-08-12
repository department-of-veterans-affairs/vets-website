import React from 'react';
import PropTypes from 'prop-types';

export const EnrollmentStatus = ({ start, end, total, dontHaveEnrollment }) => {
  const showingEnrollment = `Showing ${start}${
    end > 0 ? ` - ${end}` : ''
  } of ${total} monthly enrollments listed by most recent`;
  return (
    <p
      id="vye-pagination-page-status-text"
      className="focus-element-on-pagination"
      aria-label={showingEnrollment}
      aria-hidden="false"
    >
      {showingEnrollment}

      {(dontHaveEnrollment || total === 0) && (
        <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2">
          {dontHaveEnrollment
            ? 'You currently have no enrollments.'
            : 'You currently have no enrollments to verify.'}
        </span>
      )}
    </p>
  );
};

EnrollmentStatus.propTypes = {
  dontHaveEnrollment: PropTypes.bool,
  end: PropTypes.number,
  start: PropTypes.number,
  total: PropTypes.number,
};
