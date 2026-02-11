import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { DemoNotation } from '../../demo';

export default function ReviewRequestsAlert({ hasOpenRequests }) {
  const navigate = useNavigate();

  if (!hasOpenRequests) {
    return null;
  }

  return (
    <>
      <DemoNotation
        theme="new"
        title="Review requests alert"
        before="No redirect - individual request alerts shown inline on Files tab"
        after="Warning alert redirects users to Status tab to complete open requests"
      />
      <va-alert class="vads-u-margin-bottom--2" status="warning">
        <h4 slot="headline">Review your requests</h4>
        <p>
          You may have evidence requests you haven't responded to yet. Review
          them before uploading additional evidence here.
        </p>
        <VaLinkAction
          href="/track-claims/your-claims"
          onClick={e => {
            e.preventDefault();
            navigate('../status');
          }}
          text="Review requests"
          type="secondary"
        />
      </va-alert>
    </>
  );
}

ReviewRequestsAlert.propTypes = {
  hasOpenRequests: PropTypes.bool.isRequired,
};
