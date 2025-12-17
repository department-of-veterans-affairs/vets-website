import React from 'react';

/**
 * Render a page indicating that the form is not yet available
 * @returns {React.Component} - No form (form is still under development)
 */
export default function NoFormPage() {
  return (
    <>
      <div className="vads-l-grid-container vads-u-margin-bottom--9 medium-screen:vads-u-padding-x--1p5">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <h1>21-0538 Dependents Verification Form</h1>
            <va-alert
              close-btn-aria-label="Close notification"
              status="info"
              visible
            >
              <h2 slot="headline">You can’t use our online form right now</h2>
              <p className="vads-u-margin-y--0">
                This form is currently in development. Please check back later.
              </p>
            </va-alert>
          </div>
        </div>
      </div>
    </>
  );
}
