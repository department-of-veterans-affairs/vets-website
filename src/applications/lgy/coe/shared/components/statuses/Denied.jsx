import React from 'react';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import { formatDate } from '../../helpers';

const coeStatusUrl = getAppUrl('coe-status');

const Denied = ({ applicationCreateDate }) => {
  const requestDate = formatDate(applicationCreateDate);

  return (
    <va-alert status="info">
      <h2 slot="headline">We denied your request for a COE</h2>
      <div>
        <p>You requested a COE on: {requestDate}</p>
        <p>
          We reviewed your request. You don’t qualify for a COE.
          <br />
          <a href={coeStatusUrl}>
            Go to your VA home loan COE page to see status details
          </a>
        </p>
      </div>
    </va-alert>
  );
};

export default Denied;
