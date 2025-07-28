import React from 'react';

export default function OmbInfo() {
  return (
    <div className="vads-u-margin-bottom--1p5">
      <p className="vads-u-margin--0">
        <span>Respondent burden:</span>{' '}
        <span className="vads-u-font-weight--bold">10 minutes</span>
      </p>
      <p className="vads-u-margin--0">
        <span>OMB Control #:</span>{' '}
        <span className="vads-u-font-weight--bold"> 2900-XXXX</span>
      </p>
      <p className="vads-u-margin--0">
        <span>Expiration date:</span>{' '}
        <span className="vads-u-font-weight--bold"> XX/XX/XXXX</span>
      </p>
    </div>
  );
}
