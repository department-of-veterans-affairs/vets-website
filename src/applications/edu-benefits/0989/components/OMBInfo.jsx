import React from 'react';
import { OMB_RES_BURDEN, OMB_NUMBER, OMB_EXP_DATE } from '../constants';

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
