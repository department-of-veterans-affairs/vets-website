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
        My dependents are correct
      </button>
      <button
        onClick={() => {
          handleCloseAndUpdateDiaries(false);
        }}
      >
        I need to change my dependents
      </button>
    </div>
  );
};

export default DependencyVerificationFooter;
