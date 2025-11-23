import React from 'react';

const ConfirmationRetirementPay = (title, yesNoTitle, branchTitle) => ({
  formData,
  showPageTitles,
}) => {
  const branchValue = formData.militaryRetiredPayBranch;
  const yesNoValue = branchValue ? 'Yes' : 'No';

  const fields = [];

  fields.push(
    <li>
      <div className="vads-u-color--gray">{yesNoTitle}</div>
      <div>{yesNoValue}</div>
    </li>,
  );

  if (branchValue) {
    fields.push(
      <li>
        <div className="vads-u-color--gray">{branchTitle}</div>
        <div>{branchValue}</div>
      </li>,
    );
  }

  if (fields.length === 0) return [];
  if (!showPageTitles) return fields;

  return (
    <li>
      <h4>{title}</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        {fields}
      </ul>
    </li>
  );
};

export default ConfirmationRetirementPay;
