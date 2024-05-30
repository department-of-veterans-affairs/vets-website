import React from 'react';
import PropTypes from 'prop-types';

export const EnrollmentStatus = ({ start, end, total, hasEnrollment }) => {
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

      {hasEnrollment && (
        <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2">
          You currently have no enrollments.
        </span>
      )}
    </p>
  );
};

EnrollmentStatus.propTypes = {
  end: PropTypes.number,
  hasEnrollment: PropTypes.bool,
  start: PropTypes.number,
  total: PropTypes.number,
};
