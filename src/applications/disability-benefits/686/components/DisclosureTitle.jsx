import React from 'react';
import get from 'lodash/get';

export default function createDisclosureTitle(path, title) {
  return function DisclosureTitle({ id, formData }) {
    let fullName;

    // A little hackish
    if (path === 'spouse') {
      const marriages = formData.marriages || [];
      fullName =
        get(formData, `marriages.${marriages.length - 1}.spouseFullName`) || {};
    } else {
      fullName = get(formData, path) || {};
    }

    return (
      <div>
        <h4 className="dependent-name">
          {fullName.first} {fullName.last}
        </h4>
        <legend className="schemaform-block-title dependent-title" id={id}>
          {title}
        </legend>
      </div>
    );
  };
}
