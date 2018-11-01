import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import brandConsolidation from '../../../brand-consolidation';

export default class VAPlusVetsModal extends React.Component {
  static isEnabled() {
    if (!brandConsolidation.isEnabled()) return false;

    const referrer = document.referrer;
    let wasRedirectedFromVets = !!referrer && referrer.includes('vets.gov');

    // Allow an override on the URL to force the Onboarding Modal to appear for testing purposes.s
    if (__BUILDTYPE__ !== 'preview' && !wasRedirectedFromVets) {
      wasRedirectedFromVets = window.location.search.includes(
        'onboarding-modal',
      );
    }

    return wasRedirectedFromVets;
  }

  render() {
    const { dismiss } = this.props;

    return (
      <Modal
        cssClass="va-modal announcement-brand-consolidation"
        visible
        onClose={dismiss}
        id="modal-announcement"
      >
        <div className="announcement-heading-brand-consolidation">
          <img
            className="announcement-brand-consolidation-logo"
            src="/img/design/logo/va-plus-vets.png"
            alt="VA.gov plus Vets.gov"
          />
        </div>
        <h3 className="announcement-title">Vets.gov is now part of VA.gov</h3>
        <p>
          You can now find all your Vets.gov tools and information on VA.gov.
        </p>
        <p>
          With the new VA.gov, we're making it easier for you to access and
          manage your VA benefits and health care services—all in one place.
          Sign in with your My HealtheVet, DS Logon, or ID.me account to track
          your claims, refill your prescriptions, and more.
        </p>
        <button type="button" onClick={dismiss}>
          Continue to VA.gov
        </button>
      </Modal>
    );
  }
}
