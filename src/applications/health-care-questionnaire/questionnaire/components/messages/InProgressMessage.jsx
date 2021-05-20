import React from 'react';

export default function InProgressMessage(props) {
  const {
    appType,
    inProgressMessage,
    lastSavedDateTime,
    appAction,
    expirationDate,
  } = props;
  return (
    <>
      <h2>Your questionnaire is in progress.</h2>
      <div className="saved-form-metadata-container">
        {inProgressMessage && (
          <>
            <span className="saved-form-item-metadata">
              {inProgressMessage}
            </span>
            <br />
          </>
        )}
        <span className="saved-form-item-metadata">
          Your {appType} was last saved on {lastSavedDateTime}
        </span>
        <div className="expires-container">
          You can continue {appAction} now, or come back later to finish your{' '}
          {appType}.
          <span className="expires">
            {' '}
            Your {appType} will expire on {expirationDate}.
          </span>
        </div>
      </div>
      <div>{props.children}</div>
    </>
  );
}
