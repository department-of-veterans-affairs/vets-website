import React from 'react';
import get from 'platform/utilities/data/get';

export default function createDisclosureTitle(path, title) {
  return function DisclosureTitle({ id, formData }) {
    let fullName;

    // A little hackish
    if (path === 'spouse') {
      const marriages = formData.marriages || [];
      fullName =
        get(['marriages', marriages.length - 1, 'spouseFullName'], formData) ||
        {};
    } else {
      fullName = get(path, formData) || {};
    }

    return (
      <div>
        <h4 className="pensions-disclosure-name">
          {fullName.first} {fullName.last}
        </h4>
        <legend
          className="schemaform-block-title pensions-disclosure-title"
          id={id}
        >
          {title}
        </legend>
      </div>
    );
  };
}
