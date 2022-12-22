import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

function HomepageRedesignModal({ dismiss, vaHomePreviewModal }) {
  // Ensures that there are no aria attributes on noscript elements to interfere with screenreader focus
  useEffect(() => {
    const noscriptElement = document.getElementsByTagName('noscript')[0];
    noscriptElement.removeAttribute('aria-hidden');
    noscriptElement.removeAttribute('data-aria-hidden');
  }, []);

  return (
    <>
      {vaHomePreviewModal && (
        <VaModal
          role="dialog"
          cssClass="va-modal announcement-brand-consolidation"
          visible
          onCloseEvent={() => {
            recordEvent({ event: 'new-homepage-modal-close' });
            dismiss();
          }}
          id="modal-announcement"
          modalTitle=""
          aria-describedby="homepage-modal-description"
          aria-labelledby="homepage-modal-label-title"
          secondary-button-text="Not today, go to the current homepage"
          onSecondaryButtonClick={() => {
            recordEvent({
              event: 'new-homepage-modal-click',
              'modal-secondary-link': 'go to current homepage',
            });
            dismiss();
          }}
        >
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
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
                  event: 'new-homepage-modal-click',
                  'modal-primaryButton-text': 'try the new homepage',
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
  vaHomePreviewModal: PropTypes.bool,
};

const mapStateToProps = state => ({
  vaHomePreviewModal: toggleValues(state)[
    FEATURE_FLAG_NAMES.vaHomePreviewModal
  ],
});

export default connect(mapStateToProps)(HomepageRedesignModal);
