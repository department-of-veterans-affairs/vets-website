import React from 'react';

const serviceHistoryDescription = props => (
  <>
    <p>
      This information here is only for your health care form. Any changes you
      make will only apply to this form and won’t update your saved profile.
    </p>
    <ServiceHistorySummary formData={props.formData} />
  </>
);

export const ServiceHistorySummary = ({ formData }) => {
  const history = formData || {};
  const dateOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };
  return (
    <va-card uswds="true" className="vads-u-margin-bottom--2">
      <h4 className="vads-u-margin-top--0 dd-privacy-mask">
        {(history?.lastServiceBranch || 'Not Given')
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')}
      </h4>
      {history?.lastEntryDate
        ? new Date(history?.lastEntryDate).toLocaleDateString(
            'en-US',
            dateOptions,
          )
        : 'Not Given'}
      {' — '}
      {history?.lastDischargeDate
        ? new Date(history?.lastDischargeDate).toLocaleDateString(
            'en-US',
            dateOptions,
          )
        : 'Not Given'}
    </va-card>
  );
};

export default serviceHistoryDescription;
