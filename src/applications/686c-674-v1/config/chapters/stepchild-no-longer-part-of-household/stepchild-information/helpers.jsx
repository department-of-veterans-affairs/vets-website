import React from 'react';

export function StepchildTitle({ formData }) {
  return (
    <div>
      <h3 className="vads-u-border-color--link-default vads-u-border-bottom--2px vads-u-margin-top--0 vads-u-padding-bottom--0p5">
        {formData.fullName.first} {formData.fullName.last}
      </h3>
    </div>
  );
}
