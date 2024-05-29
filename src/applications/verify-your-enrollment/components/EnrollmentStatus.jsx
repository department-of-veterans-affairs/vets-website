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
      <p className="vads-u-font-weight--bold">
        You currently have no enrollments.
      </p>
    )}
  </p>
);

EnrollmentStatus.propTypes = {
  end: PropTypes.number,
  isError: PropTypes.bool,
  start: PropTypes.number,
  total: PropTypes.number,
};
