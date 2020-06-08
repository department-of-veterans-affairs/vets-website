import React from 'react';

export function SpouseTitle({ formData }) {
  return (
    <div>
      <h3 className="vads-u-border-color--link-default vads-u-border-bottom--2px vads-u-margin-top--0 vads-u-padding-bottom--0p5 vads-u-font-size--h4">
        {formData.fullName.first} {formData.fullName.last}
      </h3>
    </div>
  );
}
