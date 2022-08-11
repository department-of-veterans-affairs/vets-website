import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const COEAccess = ({ includedInFlipper }) => {
  if (includedInFlipper === undefined) {
    return <va-loading-indicator set-focus message="Loading..." />;
  }
  if (includedInFlipper) {
    return (
      <>
        <p>You can request a COE online right now.</p>
        <a
          className="vads-c-action-link--green"
          href="/housing-assistance/home-loans/request-coe-form-26-1880"
        >
          Request a COE
        </a>
        <h3>You can also request a COE:</h3>
        <h4>Through your lender</h4>
        <p>
          Your lender may be able to use an online system (called Web LGY) to
          get your COE. Ask your lender about this option.
        </p>
        <h4>By mail</h4>
        <p>
          To request a COE by mail, fill out a Request for a Certificate of
          Eligibility (VA Form 26-1880) and mail it to the address for your
          regional loan center. You can find the address on the last page of the
          form. Please note that mail requests may take longer than requesting a
          COE online or through your lender.
        </p>
        <p>
          <a href="/find-forms/about-form-26-1880/">
            Get VA Form 26-1880 to download
          </a>
        </p>
      </>
    );
  }
  return (
    <>
      <p>You can request a COE through your lender or by mail.</p>
      <h3>Through your lender</h3>
      <p>
        Your lender may be able to use an online system (called Web LGY) to get
        your COE. Ask your lender about this option.
      </p>
      <h3>By mail</h3>
      <p>
        To request a COE by mail, fill out a Request for a Certificate of
        Eligibility (VA Form 26-1880) and mail it to the address for your
        regional loan center. You can find the address on the last page of the
        form. Please note that mail requests may take longer than requesting a
        COE through your lender.
      </p>
      <a
        className="vads-c-action-link--green"
        href="https://www.va.gov/find-forms/about-form-26-1880/"
      >
        Get VA Form 26-1880 to download
      </a>
    </>
  );
};

COEAccess.propTypes = {
  includedInFlipper: PropTypes.bool,
};

const mapStateToProps = store => ({
  includedInFlipper: toggleValues(store)[FEATURE_FLAG_NAMES.coeAccess],
});

export default connect(mapStateToProps)(COEAccess);
