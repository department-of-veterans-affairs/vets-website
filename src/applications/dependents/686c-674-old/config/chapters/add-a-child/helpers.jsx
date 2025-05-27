import React from 'react';

export const ChildNameHeader = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <div>
      <p className="vads-u-font-weight--bold vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary vads-u-font-family--serif">
        {first[0].toUpperCase()}
        {first.slice(1).toLowerCase()} {last[0].toUpperCase()}
        {last.slice(1).toLowerCase()}
      </p>
    </div>
  );
};
