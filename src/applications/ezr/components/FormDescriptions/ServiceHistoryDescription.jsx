import React from 'react';

const serviceHistoryDescription = (
  <p>
    This information here is only for your health care form. Any changes you
    make will only apply to this form and won’t update your saved profile.
  </p>
);

export const serviceHistorySummary = ({ uiSchema }) => {
  const history = uiSchema?.['ui:options']?.fullFormData || {};
  return (
    <va-card uswds="true" className="vads-u-margin-bottom--2">
      <h4 className="vads-u-margin-top--0 dd-privacy-mask">
        {history?.lastServiceBranch} (Branch coming soon)
      </h4>
      {history?.lastEntryDate} (Date coming soon)
      {' - '}
      {history?.lastDischargeDate} (Date coming soon)
    </va-card>
  );
};

export default serviceHistoryDescription;
