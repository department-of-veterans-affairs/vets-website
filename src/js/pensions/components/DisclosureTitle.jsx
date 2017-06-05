import React from 'react';
import _ from 'lodash/fp';

export default function createDisclosureTitle(path, title) {
  return function DisclosureTitle({ id, formData }) {
    const { first, last } = _.get(path, formData) || {};
    return (
      <div>
        <h4 className="pensions-disclosure-name">{first} {last}</h4>
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
