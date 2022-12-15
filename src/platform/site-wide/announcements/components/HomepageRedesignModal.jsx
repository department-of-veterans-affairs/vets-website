import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

export function HomepageRedesignModal({ dismiss, vaHomePreviewModal }) {
  return (
    <>
      {vaHomePreviewModal && (
        // eslint-disable-next-line @department-of-veterans-affairs/prefer-web-component-library
        <Modal
          role="dialog"
          cssClass="va-modal announcement-brand-consolidation"
          visible
          onClose={() => {
            recordEvent({ event: 'new-homepage-modal-close' });
            dismiss();
          }}
          id="modal-announcement"
        >
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
          <h3>Try our new VA.gov homepage</h3>
          <p>
            We're redesigning the VA.gov homepage to help you get the tools and
            information you need faster.
          </p>
          <p>And we want your feedback to help us make it even better</p>

          <a
            className="vads-c-action-link--green"
            href="/new-home-page"
            onClick={() => {
              recordEvent({
                event: 'new-homepage-modal-click',
                'modal-primaryButton-text': 'try the new homepage',
              });
            }}
          >
            Try the new home page
          </a>

          <VaButton
            text="Not today, go to the current homepage"
            onClick={() => {
              recordEvent({
                event: 'new-homepage-modal-click',
                'modal-secondary-link': 'go to current homepage',
              });
              dismiss();
            }}
            className="vads-u-margin-top--2"
          />
        </Modal>
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
