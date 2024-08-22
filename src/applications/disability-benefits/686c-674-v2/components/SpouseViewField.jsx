import React from 'react';
import { capitalize } from 'lodash';

export default function SpouseViewField({ formData }) {
  const { first, middle, last, suffix } = formData.fullName;

  return (
    <div className="vads-u-display--flex">
      <h4 className="vads-u-margin-y--2">
        {first} {middle && `${middle} `}
        {last}
        {suffix && `, ${suffix}`}
      </h4>
      <br />
    </div>
  );
}

export const FormerSpouseHeader = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
        Former marriage to {capitalize(first)} {capitalize(last)}
      </h3>
    </legend>
  );
};
