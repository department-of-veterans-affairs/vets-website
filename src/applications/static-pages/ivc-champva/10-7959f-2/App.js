import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>
          You can file a claim online, by mail, or by fax. You’ll need your
          Security number or your VA claim number (also called VA file number).
          In most cases, your claim number and Social Security number are the
          same.
        </p>
        <p>
          <strong>Note</strong>: You don’t need to be enrolled in VA health care
          to file a claim for the Foreign Medical Program.
        </p>
        <h3>
          <strong>Option 1: Online</strong>
        </h3>
        <a
          className="vads-c-action-link--green"
          href="/health-care/foreign-medical-program/claim-form-10-7959f-2"
        >
          File a claim for the Foreign Medical Program
        </a>
        <h3>Option 2: By mail</h3>
        <p>Fill out an FMP Claim Form (VA Form 10-7959f-2).</p>
        <a href="https://www.va.gov/find-forms/about-form-10-7959f-2/">
          Get VA Form 10-7959f-2 to download
        </a>
        <p>Mail your completed form to this address:</p>
        <p className="va-address-block">
          VHA Office of Integrated Veteran Care (OIVC)
          <br />
          Foreign Medical Program (FMP)
          <br />
          P.O. Box 469061
          <br />
          Denver, CO 80246-9061
          <br />
        </p>
        <h3>Option 3: By fax</h3>
        <p>Fill out an FMP Claim Form (VA Form 10-7959f-2).</p>
        <a href="https://www.va.gov/find-forms/about-form-10-7959f-2/">
          Get VA Form 10-7959f-2 to download
        </a>
        <p>
          Fax your completed form to <va-telephone contact="3033317803" />.
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        Fill out an FMP Claim Form (VA Form 10-7959f-2). You’ll need your
        Security number or your VA claim number (also called VA file number). In
        most cases, your claim number and Social Security number are the same.
      </p>
      <p>
        <strong>Note</strong>: You don’t need to be enrolled in VA health care
        to file a claim for for the Foreign Medical Program.
      </p>
      <a
        className="vads-c-action-link--green"
        href="https://www.va.gov/find-forms/about-form-10-7959f-2/"
      >
        Get VA Form 10-7959f-2 to download
      </a>
      <h3>
        <strong>Option 1: Online</strong>
      </h3>
      <a href="https://ask.va.gov/">
        Upload your completed form through Ask VA
      </a>
      <h3>
        <strong>Option 2: By mail</strong>
      </h3>
      <p>Mail your completed form to this address:</p>
      <p className="va-address-block">
        VHA Office of Integrated Veteran Care (OIVC)
        <br />
        Foreign Medical Program (FMP)
        <br />
        P.O. Box 469061
        <br />
        Denver, CO 80246-9061
        <br />
      </p>
      <h3>
        <strong>Option 3: By fax</strong>
      </h3>
      <p>
        Fax your completed form to <va-telephone contact="3033317803" />.
      </p>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form107959f2],
});

export default connect(mapStateToProps)(App);
