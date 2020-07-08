import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import 'url-search-params-polyfill';

const EXPLORE_VA = 'explore.va.gov';

export default class VAPlusVetsModal extends React.Component {
  static isEnabled() {
    const queryParams = new URLSearchParams(window.location.search);
    const from = queryParams.get('from');

    return from === EXPLORE_VA;
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
            src="/img/design/logo/va-plus-explore.png"
            alt="VA.gov plus Explore.va.gov"
          />
        </div>
        <h3 className="announcement-title">ExploreVA is now part of VA.gov</h3>
        <p>
          You can learn about VA benefits you may be eligible for—and how to
          apply—on VA.gov. You can also sign in to track your claims, refill
          your prescriptions, and more.
        </p>
        <p>
          This is part of our continued work to make it easier for you to access
          and manage the benefits you've earned.
        </p>
        <button type="button" onClick={dismiss}>
          Continue to VA.gov
        </button>
      </Modal>
    );
  }
}
