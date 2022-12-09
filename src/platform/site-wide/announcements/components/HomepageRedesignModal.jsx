import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

export default class HomepagRedesignModal extends React.Component {
  static isEnabled() {
    // insert feature flag stuff here
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
        />
      </VaModal>
    );
  }
}

HomepagRedesignModal.propTypes = {};
