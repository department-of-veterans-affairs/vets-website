import React from 'react';
import startCase from 'lodash/startCase';

const TableDetailsView = ({ formData, onEdit, index }) => {
  const values = Object.values(formData);

  return (
    <tr className="vads-u-border-bottom--1px">
      <td className="vads-u-border--0 vads-u-padding-left--3">
        {startCase(values[0])}
      </td>
      <td className="vads-u-border--0">{values[1]}</td>
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
