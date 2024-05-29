import React from 'react';
import PropTypes from 'prop-types';

export const EnrollmentStatus = ({ start, end, total, isError }) => (
  <p
    id="vye-pagination-page-status-text"
    className="focus-element-on-pagination"
    aria-label={`Showing ${start}${
      end > 0 ? ` - ${end}` : ''
    } of ${total} monthly enrollments listed by most recent`}
    aria-hidden="false"
  >
    {`Showing ${start}${
      end > 0 ? ` - ${end}` : ''
    } of ${total} monthly enrollments listed by most recent`}
    {isError && (
      <span className="vads-u-font-weight--bold vads-u-display--block vads-u-margin-top--2">
        You currently have no enrollments.
      </span>
    )}
  </p>
);

EnrollmentStatus.propTypes = {
  end: PropTypes.number,
  isError: PropTypes.bool,
  start: PropTypes.number,
  total: PropTypes.number,
};
