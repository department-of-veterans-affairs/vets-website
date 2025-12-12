import React from 'react';

const MissingEventsAlert = () => {
  return (
    <div className="usa-alert usa-alert-warning">
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">Missing events</h4>
        <p className="usa-alert-text">
          There may be some events missing from this page. If you have questions
          about a past form or VA decision, please contact your VSO or
          representative for more information.
        </p>
      </div>
    </div>
  );
};

export default MissingEventsAlert;
