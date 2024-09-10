import React from 'react';
import { capitalize } from 'lodash';

export default function ChildViewField({ formData }) {
  const { first, middle, last, suffix } = formData.fullName;

  return (
    <div className="vads-u-display--flex">
      <h4>
        {capitalize(first)} {capitalize(middle && `${middle} `)}
        {capitalize(last)}
        {capitalize(suffix && `, ${suffix}`)}
      </h4>
      <br />
    </div>
  );
}

// TODO: Consolidate to single viewField component later on
