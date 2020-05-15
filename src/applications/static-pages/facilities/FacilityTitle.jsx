import React from 'react';

export default function FacilityTitle({ regionPath, facility }) {
  return (
    <h3 className="vads-u-margin-bottom--1 vads-u-margin-top--0 vads-u-font-size--md medium-screen:vads-u-font-size--lg">
      <a href={regionPath}>{facility.attributes.name}</a>
    </h3>
  );
}
