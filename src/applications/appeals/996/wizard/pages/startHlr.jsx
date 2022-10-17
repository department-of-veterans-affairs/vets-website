import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import { HLR_INFO_URL, BASE_URL } from '../../constants';
import pageNames from './pageNames';

// Does not have a legacy appeal
const startHlr = ({ setWizardStatus }) => {
  recordEvent({
    event: 'howToWizard-alert-displayed',
    'reason-for-alert': 'no legacy issues; form can be started',
  });
  recordEvent({
    event: 'howToWizard-cta-displayed',
  });

  const handlers = {
    startLinkClick: () => {
      recordEvent({
        event: 'howToWizard-hidden',
        'reason-for-hidden-wizard': 'wizard completed, starting form',
      });
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'primary',
        'button-click-label': 'Request a Higher-Level Review online',
      });
      setWizardStatus(WIZARD_STATUS_COMPLETE);
    },
    otherLinkClick: () => {
      recordEvent({
        event: 'howToWizard-alert-link-click',
        'howToWizard-alert-link-click-label':
          'Learn about other ways you can request a Higher-Level Review',
      });
    },
  };

  return (
    <div
      id={pageNames.startHlr}
      className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2"
    >
      <p className="vads-u-margin-top--0">
        You can request a Higher-Level Review online using{' '}
        <strong>VA Form 20-0996</strong>.
      </p>
      <a
        href={`${BASE_URL}/introduction`}
        onClick={handlers.startLinkClick}
        className="vads-c-action-link--green"
        aria-describedby="other_ways_to_request_hlr"
      >
        Request a Higher-Level Review online
      </a>
      <p id="other_ways_to_request_hlr" className="vads-u-margin-bottom--0">
        <a href={HLR_INFO_URL} onClick={handlers.otherLinkClick}>
          Learn about other ways you can request a Higher-Level Review
        </a>
      </p>
    </div>
  );
};

startHlr.propTypes = {
  setWizardStatus: PropTypes.func,
};

export default {
  name: pageNames.startHlr,
  component: startHlr,
};
