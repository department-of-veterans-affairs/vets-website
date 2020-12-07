import React from 'react';

const TableDetailsView = ({ formData, onEdit, index }) => {
  return (
    <tr className="vads-u-border-bottom--1px">
      <td className="vads-u-border--0 vads-u-padding-left--3">
        {formData?.utilityType}
      </td>
      <td className="vads-u-border--0">{formData?.monthlyUtilityAmount}</td>
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
