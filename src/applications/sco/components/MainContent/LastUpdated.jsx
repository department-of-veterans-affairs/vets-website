import React from 'react';

const LAST_UPDATED_DATE_TIME = '2024-05-07';
const LAST_UPDATED_DATE = 'July 15, 2024';

const LastUpdated = () => {
  const feedbackButtonClicked = () => {
    window.KAMPYLE_ONSITE_SDK?.showForm('17');
  };

  return (
    <div className="last-updated usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
      <div className="mobile-lg:vads-u-display--flex above-footer-elements-container">
        <div className="vads-u-flex--auto">
          <span className="vads-u-text-align--justify">
            <p>
              Last updated:{' '}
              <time dateTime={LAST_UPDATED_DATE_TIME}>{LAST_UPDATED_DATE}</time>
            </p>
          </span>
        </div>
        <div className="vads-u-flex--1 vads-u-text-align--right">
          <span className="vads-u-text-align--right">
            <button
              type="button"
              className="feedback-button usa-button"
              id="mdFormButton"
              aria-label="give feedback"
              onClick={feedbackButtonClicked}
            >
              Feedback
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LastUpdated;
