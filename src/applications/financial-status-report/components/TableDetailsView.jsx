import React from 'react';

const TableDetailsView = ({ formData, onEdit, index }) => {
  const values = formData && Object.values(formData);
  const keys = formData && Object.keys(formData);

  const formatter = value => {
    const isNumber = !isNaN(value);
    if (isNumber) {
      const num = Number(value);
      return `$${num.toFixed(2)}`;
    }
    return value;
  };

  const renderDetails = data => {
    return data?.map((key, i) => (
      <td key={`${key}-${i}`} className="vads-u-border--0">
        {formatter(values[i])}
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
