import React from 'react';

export const StudentNameHeader = ({ formData }) => {
  const { first, last } = formData.studentNameAndSSN.fullName;
  return (
    <div>
      <p className="vads-u-font-weight--bold vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary vads-u-font-family--serif">
        {first.toUpperCase()} {last.toUpperCase()}
      </p>
    </div>
  );
};

export const generateHelpText = (
  text,
  className = 'vads-u-color--gray vads-u-font-size--md',
) => {
  return <span className={className}>{text}</span>;
};
