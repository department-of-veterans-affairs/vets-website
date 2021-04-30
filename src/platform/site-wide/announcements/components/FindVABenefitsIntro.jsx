import React from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

function FindVABenefitsIntro({ dismiss, isVisible }) {
  if (!isVisible) {
    return null;
  }
  return (
    <Modal visible onClose={dismiss} id="modal-announcement">
      <div className="announcement-heading">
        <img aria-hidden="true" alt="" src="/img/dashboard-form.svg" />
      </div>
      <h3 className="announcement-title" id="modal-announcement-title">
        We can help you find and apply for benefits.
      </h3>
      <p>
        Our new “Find VA benefits” tool can help you quickly learn which
        benefits you may be eligible for, and how to apply. Get started by
        clicking on the “Find VA benefits now” button below.
      </p>
      <a onClick={dismiss} className="usa-button" href="find-benefits/">
        Find VA benefits now
      </a>
      <button
        type="button"
        className="usa-button-secondary"
        aria-label="No thanks"
        onClick={dismiss}
      >
        No, thanks
      </button>
    </Modal>
  );
}

const mapStateToProps = state => {
  const showDashboard2 = toggleValues(state)[
    FEATURE_FLAG_NAMES.dashboardShowDashboard2
  ];
  return {
    isVisible: !showDashboard2,
  };
};

export default connect(mapStateToProps)(FindVABenefitsIntro);
