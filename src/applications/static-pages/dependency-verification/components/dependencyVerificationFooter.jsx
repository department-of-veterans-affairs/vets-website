import React from 'react';
import PropTypes from 'prop-types';

const DependencyVerificationFooter = ({ handleCloseAndUpdateDiaries }) => {
  return (
    <div>
      <button
        className="usa-button-secondary"
        onClick={() => {
          handleCloseAndUpdateDiaries(true);
        }}
        type="button"
      >
        This is correct
      </button>
      <button
        onClick={() => {
          handleCloseAndUpdateDiaries(false);
        }}
        type="button"
      >
        Add or remove dependents
      </button>
    </div>
  );
};

DependencyVerificationFooter.propTypes = {
  handleCloseAndUpdateDiaries: PropTypes.func,
};

export default DependencyVerificationFooter;
