import React from 'react';

const DependencyVerificationFooter = ({ handleCloseAndUpdateDiaries }) => {
  return (
    <div>
      <button
        className="usa-button-secondary"
        onClick={() => {
          handleCloseAndUpdateDiaries(true);
        }}
      >
        This is correct
      </button>
      <button
        onClick={() => {
          handleCloseAndUpdateDiaries(false);
        }}
      >
        Change dependents
      </button>
    </div>
  );
};

export default DependencyVerificationFooter;
