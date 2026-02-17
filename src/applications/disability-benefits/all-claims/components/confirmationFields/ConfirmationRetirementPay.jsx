import React from 'react';

const ConfirmationRetirementPay =
  (title, yesNoTitle, branchTitle) =>
  ({ formData }) => {
    const branchValue = formData.militaryRetiredPayBranch;
    const yesNoValue = branchValue ? 'Yes' : 'No';

    return (
      <li>
        <h4>{title}</h4>
        <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
          <li>
            <div className="vads-u-color--gray">{yesNoTitle}</div>
            <div>{yesNoValue}</div>
          </li>
          {branchValue && (
            <li>
              <div className="vads-u-color--gray">{branchTitle}</div>
              <div>{branchValue}</div>
            </li>
          )}
        </ul>
      </li>
    );
  };

export default ConfirmationRetirementPay;
