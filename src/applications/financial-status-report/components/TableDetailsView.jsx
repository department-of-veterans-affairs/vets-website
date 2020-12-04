import React from 'react';

const TableDetailsView = () => {
  const data = [
    {
      type: 'Electricity',
      amount: '$150.00',
    },
    {
      type: 'Gas',
      amount: '$50.00',
    },
    {
      type: 'Water',
      amount: '$25.00',
    },
  ];

  return (
    <table className="vads-u-font-family--sans vads-u-margin-top--3 vads-u-margin-bottom--0">
      <thead>
        <tr>
          <th className="vads-u-border--0 vads-u-padding-left--3">
            Type of utility
          </th>
          <th className="vads-u-border--0">Monthly payment amount</th>
          <th className="vads-u-border--0" />
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            className="vads-u-border-top--1px vads-u-border-bottom--1px"
          >
            <td className="vads-u-border--0 vads-u-padding-left--3">
              {item.type}
            </td>
            <td className="vads-u-border--0">{item.amount}</td>
            <td className="vads-u-border--0">
              <a target="_blank" rel="noopener noreferrer" onClick={() => {}}>
                <span aria-hidden="true">Edit</span>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableDetailsView;
