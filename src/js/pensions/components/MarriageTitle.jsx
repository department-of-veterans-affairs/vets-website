import React from 'react';
import { getMarriageTitle } from '../helpers';

export default function MarriageTitle({ id, formContext }) {
  return (
    <legend
        className="schemaform-block-title"
        id={id}>
      {getMarriageTitle(formContext.pagePerItemIndex)}
    </legend>
  );
}
