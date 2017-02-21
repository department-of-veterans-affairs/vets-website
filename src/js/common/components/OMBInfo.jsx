import React from 'react';

export default function OMBInfo({ resBurden, ombNumber, expDate }) {
  return (
    <div className="omb-info">
      <div>Respondent burden: <strong>{resBurden} minutes</strong></div>
      <div>OMB Control # <strong>{ombNumber}</strong></div>
      <div>Expiration date: <strong>{expDate}</strong></div>
      <div><a href="#">Privacy Act Statement</a></div>
    </div>
  );
}
