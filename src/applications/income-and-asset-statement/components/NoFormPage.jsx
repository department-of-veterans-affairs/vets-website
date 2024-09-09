import React from 'react';

export const NoFormPage = () => (
  <div className="vads-l-grid-container vads-u-margin-bottom--9 medium-screen:vads-u-padding-x--1p5">
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--9">
        <h1>21P-0969 Income and Asset Statement Form</h1>
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h2 slot="headline">
            You can’t use our online application right now
          </h2>
          <p className="vads-u-margin-y--0">Please check back later.</p>
        </va-alert>
      </div>
    </div>
  </div>
);
