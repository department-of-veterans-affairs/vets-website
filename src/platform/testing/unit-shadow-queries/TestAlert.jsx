import React from 'react';

function TestAlert() {
  return (
    <div>
      <va-alert status="info">
        <h3 id="alert-heading" slot="headline">
          This is an info alert
        </h3>
        <p id="alert-text">Here's some additional information in an alert.</p>
      </va-alert>
    </div>
  );
}

export default TestAlert;
