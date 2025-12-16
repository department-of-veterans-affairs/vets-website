import React from 'react';
import PropTypes from 'prop-types';
import { getCernerURL } from 'platform/utilities/cerner';
import { GA_PREFIX } from '../utils/constants';

function handleClick() {
  window.recordEvent({
    event: `${GA_PREFIX}-oh-transition-alert-cerner-redirect`,
  });
}

export default function OhTransitionAlert({ className }) {
  return (
    <div className={className}>
      <va-alert-expandable
        status="info"
        trigger="You can now manage most of your appointments for all VA facilities right here"
        data-testid="oh-transition-alert"
      >
        <p>
          We've brought all your VA health care data together so you can manage
          your care in one place. You can manage most of your appointments here.
        </p>
        <p>
          <strong>Still want to use My VA Health for now?</strong>
        </p>
        <va-link-action
          text="Go to My VA Health"
          type="secondary"
          href={getCernerURL('/pages/scheduling/upcoming', true)}
          onClick={handleClick}
        />
      </va-alert-expandable>
    </div>
  );
}

OhTransitionAlert.propTypes = {
  className: PropTypes.string,
};
