import React from 'react';
import PropTypes from 'prop-types';

export const VetTecApprovedPrograms = ({
  institution: { approvedPrograms },
}) => {
  if (!approvedPrograms) {
    return (
      <div>
        <p>
          Program data isn’t available for this provider.{' '}
          <a href={''} target="_blank" rel="noopener noreferrer">
            Learn more about VET TEC programs
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  );
};

VetTecApprovedPrograms.propTypes = {
  institution: PropTypes.object,
};

export default VetTecApprovedPrograms;
