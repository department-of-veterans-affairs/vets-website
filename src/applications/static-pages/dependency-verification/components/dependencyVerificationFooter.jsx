import React from 'react';

const DependencyVerificationFooter = ({
  handleClose,
  handleCloseAndUpdateDiaries,
}) => {
  return (
    <div className="medium-screen:vads-u-display--flex">
      <button
        className="usa-button-secondary"
        onClick={handleCloseAndUpdateDiaries}
      >
        This is correct
      </button>
      <button onClick={handleClose}>Make changes</button>
      <div className="vads-u-display--flex vads-u-flex--1 medium-screen:vads-u-justify-content--flex-end vads-u-align-items--center">
        <a tabIndex="0" role="button" onClick={handleClose}>
          Skip this for now
        </a>
      </div>
    </div>
  );
};

export default DependencyVerificationFooter;
