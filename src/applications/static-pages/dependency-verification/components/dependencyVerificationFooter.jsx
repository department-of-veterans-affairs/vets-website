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
        This is correct
      </button>
      <button onClick={handleClose}>Make changes</button>
    </div>
  );
};

export default DependencyVerificationFooter;
