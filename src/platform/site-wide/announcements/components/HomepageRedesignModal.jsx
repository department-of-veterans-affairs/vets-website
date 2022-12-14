import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';

export function HomepagRedesignModal({ dismiss, vaHomePreviewModal }) {
  return (
    <>
      {vaHomePreviewModal && (
        // eslint-disable-next-line @department-of-veterans-affairs/prefer-web-component-library
        <Modal
          cssClass="va-modal announcement-brand-consolidation"
          visible
          onClose={dismiss}
          id="modal-announcement"
        >
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
          <h3>Try our new VA.gov homepage</h3>
          <p>
            We're redesigning the VA.gov homepage to help you get the tools and
            information you need faster.
          </p>
          <p>And we want your feedback to help us make it even better</p>

          <a className="vads-c-action-link--green" href="/new-home-page">
            Try the new home page
          </a>

          <VaButton
            text="Not today, go to the current homepage"
            onClick={dismiss}
            className="vads-u-margin-top--2"
          />
        </Modal>
      )}
    </>
  );
}
HomepagRedesignModal.propTypes = {
  dismiss: PropTypes.func,
  vaHomePreviewModal: PropTypes.bool,
};

const mapStateToProps = state => ({
  vaHomePreviewModal: toggleValues(state)[
    FEATURE_FLAG_NAMES.vaHomePreviewModal
  ],
});

export default connect(mapStateToProps)(HomepagRedesignModal);
