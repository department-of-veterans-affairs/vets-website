import React from 'react';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const TableDetailsView = ({ formData, onEdit, index }) => {
  const values = formData && Object.values(formData);
  const keys = formData && Object.keys(formData);

  const format = value => {
    const isNumber = !isNaN(value);
    if (isNumber) {
      return formatter.format(value);
    }
    return value;
  };

  const renderDetails = data => {
    return data?.map((key, i) => (
      <td key={`${key}-${i}`} className="vads-u-border--0">
        {format(values[i])}
      </td>
    ));
  };

  return (
    <tr className="vads-u-border-bottom--1px">
      {renderDetails(keys)}
      <td className="vads-u-border--0">
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => onEdit(e, index)}
        >
          <span aria-hidden="true">Edit</span>
        </a>
      </td>
    </tr>
  );
};

export default TableDetailsView;
