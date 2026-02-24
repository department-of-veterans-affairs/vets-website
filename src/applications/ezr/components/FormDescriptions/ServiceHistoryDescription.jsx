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
      <h3 className="vads-u-margin-top--0 dd-privacy-mask"> {branch} </h3>
      {formatDate(formData.lastEntryDate)} &ndash;{' '}
      {formatDate(formData.lastDischargeDate)}
    </va-card>
  );
};

ServiceHistorySummary.propTypes = {
  formData: PropTypes.object,
};

export default ServiceHistorySummary;
