import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const ServiceHistorySummary = ({ formData = {} }) => {
  const branch = useMemo(
    () =>
      (formData.lastServiceBranch || 'Not Given')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    [formData],
  );

  const formatDate = useCallback(
    (
      dateStr,
      options = {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      },
      deflt = 'Not Given',
    ) =>
      dateStr ? new Date(dateStr).toLocaleDateString('en-US', options) : deflt,
    [],
  );

  return (
    <va-card uswds="true" className="vads-u-margin-bottom--2">
      <h3 className="vads-u-margin-top--0 dd-privacy-mask">
        Last service period
      </h3>
      <ul className="no-bullets vads-u-margin-top--0">
        <li>Branch of Service: {branch}</li>
        <li>
          Service Period: {formatDate(formData.lastEntryDate)}
          {' — '}
          {formatDate(formData.lastDischargeDate)}
        </li>
      </ul>
    </va-card>
  );
};

ServiceHistorySummary.propTypes = {
  formData: PropTypes.object,
};

export default ServiceHistorySummary;
