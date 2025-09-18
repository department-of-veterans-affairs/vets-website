import React from 'react';

// const OMB_RES_BURDEN = 840;
const OMB_NUMBER = '2900-0718 ';
const OMB_EXP_DATE = '01/31/2028';

export default function OmbInfo() {
  return (
    <div className="vads-u-margin-bottom--1p5">
      <p className="vads-u-margin--0">
        <span>Respondent burden:</span>{' '}
        <span className="vads-u-font-weight--bold">14 hours</span>
      </p>
      <p className="vads-u-margin--0">
        <span>OMB Control #:</span>{' '}
        <span className="vads-u-font-weight--bold"> {OMB_NUMBER}</span>
      </p>
      <p className="vads-u-margin--0">
        <span>Expiration date:</span>{' '}
        <span className="vads-u-font-weight--bold"> {OMB_EXP_DATE}</span>
      </p>
    </div>
  );
}
