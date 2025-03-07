import React from 'react';

export const UseMyLocation = ({ geolocationInProgress, handleLocateUser }) => {
  return (
    <>
      {geolocationInProgress ? (
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--primary">
          <va-icon size={3} icon="autorenew" aria-hidden="true" />
          <span aria-live="assertive">Finding your location...</span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            type="button"
            className="vads-u-line-height--3 vads-u-padding--0 vads-u-margin--0 vads-u-color--primary vads-u-background-color--white vads-u-font-weight--normal"
            onClick={handleLocateUser}
          >
            <va-icon icon="near_me" size={3} />
            Use my location
          </button>
        </>
      )}
    </>
  );
};
