import React from 'react';

const OMB_RES_BURDEN = 20;
const OMB_NUMBER = '2900-0853';
const OMB_EXP_DATE = '08/31/2025';

export default function OMBInfo() {
  return (
    <div className="vads-u-margin-bottom--1p5">
      <p className="vads-u-margin--0">
        <span>Respondent burden:</span>{' '}
        <span className="vads-u-font-weight--bold">
          {OMB_RES_BURDEN} minutes
        </span>
      </p>
      <p className="vads-u-margin--0">
        <span>OMB Control #:</span>{' '}
        <span className="vads-u-font-weight--bold">{OMB_NUMBER}</span>
      </p>
      <p className="vads-u-margin--0">
        <span>Expiration date:</span>{' '}
        <span className="vads-u-font-weight--bold">{OMB_EXP_DATE}</span>
      </p>
    </div>
  );
}
