import React from 'react';
// import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export const ReviewTable = () => {
  const formData = useSelector(state => state.form?.data || {});

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="vads-u-margin-y--2">
        <p>No form data available to review.</p>
      </div>
    );
  }

  // Simple approach - just show all non-view fields
  const displayData = Object.entries(formData)
    .filter(([key, value]) => {
      return (
        !key.startsWith('view:') &&
        !key.startsWith('ui:') &&
        value !== undefined &&
        value !== null &&
        value !== ''
      );
    })
    .map(([key, value]) => ({
      field: key,
      value:
        typeof value === 'object'
          ? JSON.stringify(value, null, 2)
          : String(value),
    }));

  if (displayData.length === 0) {
    return (
      <div className="vads-u-margin-y--2">
        <p>No reviewable form data found.</p>
      </div>
    );
  }

  return (
    <va-table
      table-title="This is a stacked bordered table."
      table-type="bordered"
    >
      <va-table-row slot="headers">
        <span>Question</span>
        <span>Answer</span>
      </va-table-row>
      {displayData.map((item, index) => (
        <va-table-row key={`review-row-${index}`}>
          <span>{item.field}</span>
          <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {item.value}
          </span>
        </va-table-row>
      ))}
    </va-table>
  );
};

ReviewTable.propTypes = {
  // formConfig: PropTypes.object.isRequired,
};
