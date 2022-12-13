import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';

export class HomepagRedesignModal extends React.Component {
  static isEnabled() {
    // insert feature flag stuff here
    const { vaHomePreviewModal } = this.props;
    return vaHomePreviewModal;
  }

  render() {
    const { dismiss } = this.props;

    return (
      <VaModal
        cssClass="va-modal announcement-brand-consolidation"
        visible
        onCloseEvent={dismiss}
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
      </VaModal>
    );
  }
}

HomepagRedesignModal.propTypes = {
  vaHomePreviewModal: PropTypes.bool,
};

const mapStateToProps = state => ({
  vaHomePreviewModal: toggleValues(state)[
    FEATURE_FLAG_NAMES.vaHomePreviewModal
  ],
});

export default connect(mapStateToProps)(HomepagRedesignModal);
