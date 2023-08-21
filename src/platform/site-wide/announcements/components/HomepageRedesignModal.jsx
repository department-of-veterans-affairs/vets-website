import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

function HomepageRedesignModal({ dismiss }) {
  const noscriptElements = document.getElementsByTagName('noscript');
  const ariaExcludeArray = Array.from(noscriptElements);
  const skipLinkElement = document.getElementsByClassName('show-on-focus')[0];
  ariaExcludeArray.push(skipLinkElement);

  // Prevents modal from showing when redirected to homepage for auth
  let hasRedirectParam = false;
  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    hasRedirectParam = searchParams.has('next');
  }

  return (
    <>
      {!hasRedirectParam && (
        <VaModal
          role="dialog"
          cssClass="va-modal announcement-brand-consolidation"
          visible
          onCloseEvent={() => {
            recordEvent({
              event: 'int-modal-click',
              'modal-status': 'closed',
              'modal-title': 'Try our new VA.gov homepage',
            });
            dismiss();
          }}
          id="modal-announcement"
          modalTitle=""
          ariaHiddenNodeExceptions={ariaExcludeArray}
          aria-describedby="homepage-modal-description"
          aria-labelledby="homepage-modal-label-title"
          secondary-button-text="Not today, go to the current homepage"
          onSecondaryButtonClick={() => {
            recordEvent({
              event: 'cta-button-click',
              'button-type': 'secondary',
              'button-click-label': 'Not today, go to the current homepage',
            });
            dismiss();
          }}
        >
          <img
            src="/img/design/logo/va-logo.png"
            alt="VA logo and Seal, U.S. Department of Veterans Affairs"
            width="300"
          />
          <h1
            id="homepage-modal-label-title"
            className="vads-u-font-size--lg vads-u-margin-top--2p5"
          >
            Try our new VA.gov homepage
          </h1>
          <div
            id="homepage-modal-description"
            className="vads-u-margin-bottom--2"
          >
            <p>
              We're redesigning the VA.gov homepage to help you get the tools
              and information you need faster.
            </p>
            <p>And we want your feedback to help us make it even better.</p>

            <a
              className="vads-c-action-link--green"
              href="/new-home-page"
              onClick={() => {
                dismiss();
                recordEvent({
                  event: 'cta-button-click',
                  'button-click-label': 'Try the new home page',
                  'button-type': 'link',
                });
              }}
            >
              Try the new home page
            </a>
          </div>
        </VaModal>
      )}
    </>
  );
}

HomepageRedesignModal.propTypes = {
  dismiss: PropTypes.func,
};

export default HomepageRedesignModal;
