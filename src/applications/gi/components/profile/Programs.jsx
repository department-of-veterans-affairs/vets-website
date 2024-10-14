import React from 'react';
import PropTypes from 'prop-types';

export default function Programs({ programCategories }) {
  return (
    <>
      <p className="">
        The following programs are approved by the VA at this institution.
      </p>
      {programCategories.map((programCategory, index) => (
        <span
          key={index}
          className="program-link-wrapper vads-u-display--flex vads-u-justify-content--space-between"
        >
          <p className="vads-u-font-weight--bold vads-u-padding-right--2">
            {programCategory}
          </p>
          <a
            href="/"
            className="vads-u-display--flex vads-u-align-items--center  "
          >
            See All
          </a>
        </span>
      ))}
    </>
  );
}

Programs.propTypes = {
  programCategories: PropTypes.array,
};
