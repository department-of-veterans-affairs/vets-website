import React from 'react';

const DependencyVerificationFooter = ({
  handleClose,
  handleCloseAndUpdateDiaries,
}) => {
  return (
    <div>
      <button
        className="usa-button-secondary"
        onClick={handleCloseAndUpdateDiaries}
      >
        Verify this is correct
      </button>
      <button onClick={handleClose}>Change dependents</button>
    </div>
  );
};

export default DependencyVerificationFooter;
