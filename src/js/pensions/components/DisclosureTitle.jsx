import React from 'react';
import _ from 'lodash/fp';

export default function createDisclosureTitle(path, title) {
  return function DisclosureTitle({ id, formData }) {
    const nameData = _.get(path, formData);
    const name = nameData ? `${nameData.first} ${nameData.last}` : null;
    return (
      <div>
        <h4 className="pensions-disclosure-name">{name}</h4>
        <legend
            className="schemaform-block-title pensions-disclosure-title"
            id={id}
            tabIndex="-1">
          {title}
        </legend>
      </div>
    );
  };
}
