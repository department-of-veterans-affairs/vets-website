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
          You can register online, by mail, or by fax. You’ll need your Social
          Security number or your VA claim number (also called VA file number).
          In most cases, your claim number and Social Security number are the
          same.
        </p>
        <p>
          <strong>Note</strong>: You don’t need to be enrolled in VA health care
          to register for the Foreign Medical Program.
        </p>
        <h3>
          <strong>Option 1: Online</strong>
        </h3>
        <a
          className="vads-c-action-link--blue"
          href="/health-care/foreign-medical-program/register-form-10-7959f-1"
        >
          Register for the Foreign Medical Program
        </a>
        <h3>Option 2: By Mail</h3>
        <p>Fill out an FMP Registration Form (VA Form 10-7959f-1).</p>
        <a href="https://www.va.gov/find-forms/about-form-10-7959f-1/">
          Get VA Form 10-7959f-1 to download
        </a>
        <p>
          Mail your completed form to this address: VHA Office of Integrated
          Veteran Care (OIVC) Foreign Medical Program (FMP) P.O. Box 469061
          Denver, CO 80246-9061
        </p>
        <h3>Option 3: By fax</h3>
        <p>Fill out an FMP Registration Form (VA Form 10-7959f-1).</p>
        <a
          className="vads-c-action-link--blue"
          href="https://www.va.gov/find-forms/about-form-10-7959f-1/"
        >
          Get VA Form 10-7959f-1 to download
        </a>
        <p>
          Fax your completed form to <va-telephone contact="3033317803" />
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        Fill out an FMP Registration Form (VA Form 10-7959f-1). You’ll need your
        Social Security number or your VA claim number (also called VA file
        number). In most cases, your claim number and Social Security number are
        the same.
      </p>
      <p>
        <strong>Note</strong>: You don’t need to be enrolled in VA health care
        to register for the Foreign Medical Program.
      </p>
      <a
        className="vads-c-action-link--blue"
        href="https://www.va.gov/find-forms/about-form-10-7959f-1/"
      >
        Get VA Form 10-7959f-1 to download
      </a>
      <h3>
        <strong>Option 1: Online</strong>
      </h3>
      <a className="vads-c-action-link--blue" href="https://ask.va.gov/">
        Upload your completed form through Ask VA
      </a>
      <h3>
        <strong>Option 2: By Mail</strong>
      </h3>
      <p>Mail your completed form to this address:</p>
      <p>
        VHA Office of Integrated Veteran Care (OIVC) Foreign Medical Program
        (FMP) P.O. Box 469061 Denver, CO 80246-9061
      </p>
      <h3>
        <strong>Option 3: By fax</strong>
      </h3>
      <p>
        Fax your completed form to <va-telephone contact="3033317803" />
      </p>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form107959F1],
});

export default connect(mapStateToProps)(App);
