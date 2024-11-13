import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Programs = ({ programTypes, facilityCode }) => {
  return (
    <>
      <p>The following programs are approved by the VA at this institution.</p>
      {programTypes.map((programType, index) => (
        <span
          key={index}
          className="program-link-wrapper vads-u-display--flex vads-u-justify-content--space-between"
        >
          <p className="vads-u-font-weight--bold vads-u-padding-right--2">
            {programType}
          </p>
          <Link
            to={{
              pathname: `/institution/${facilityCode}/${programType
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')}`,
            }}
            className="vads-u-display--flex vads-u-align-items--center"
          >
            See All
          </Link>
        </span>
      ))}
    </>
  );
};

Programs.propTypes = {
  programTypes: PropTypes.array.isRequired,
  facilityCode: PropTypes.string.isRequired,
};

export default Programs;
