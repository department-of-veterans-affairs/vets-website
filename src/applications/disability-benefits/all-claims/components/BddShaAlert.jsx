import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  VaAlert,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SHA_PAGE_PATH = 'supporting-evidence/separation-health-assessment';

function BddShaAlert({ router }) {
  const handleLinkClick = event => {
    event.preventDefault();
    router.push(SHA_PAGE_PATH);
  };

  return (
    <VaAlert status="warning" visible>
      <h2 slot="headline">
        A Separation Health Assessment (SHA) Part A is required
      </h2>
      <p>
        We want to ensure that we have all the information we need to process
        your claim. If you do not include a SHA Part A as part of your claim, we
        will not be able to deliver a decision within 30 days after separation.
      </p>
      <p>
        <VaLink
          href={`/${SHA_PAGE_PATH}`}
          text="Check if you've uploaded a SHA Part A document"
          onClick={handleLinkClick}
        />
      </p>
    </VaAlert>
  );
}

BddShaAlert.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(BddShaAlert);
