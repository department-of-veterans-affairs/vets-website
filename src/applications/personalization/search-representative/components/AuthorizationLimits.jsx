import React from 'react';

const AuthorizationLimits = () => (
  <div className="vads-u-margin-y--1">
    <va-additional-info trigger="What are the limits of this authorization?">
      Redisclosure of these records other than to VA or the Court of Appeals for
      Veterans Claims is not authorized without your further written consent.
      This authorization will remain in effect until one of these events:
      <ul>
        <li>
          You file a written notice with VA that revokes this authorization,{' '}
          <strong>or</strong>
        </li>
        <li>
          You appoint a different accredited representative, <strong>or</strong>
        </li>
        <li>You revoke the appointment of this representative</li>
      </ul>
    </va-additional-info>
  </div>
);

export default AuthorizationLimits;
