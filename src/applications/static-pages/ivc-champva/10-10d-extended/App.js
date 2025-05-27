import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import {
  CHAMPVA_ELIGIBILITY_ADDRESS,
  CHAMPVA_FAX_NUMBER,
} from '../../../ivc-champva/shared/constants';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../ivc-champva/10-10d-extended/manifest.json';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>
          You can apply online, by mail, or by fax. Make sure to submit the
          required supporting documents with your application.
        </p>
        <va-link
          href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
          text="Find out what supporting documents you need"
        />
        <h3>
          <strong>Option 1: Online</strong>
        </h3>
        <p>You can apply online now.</p>
        <a className="vads-c-action-link--green" href={manifest.rootUrl}>
          Apply for CHAMPVA online
        </a>
        <h3>Option 2: By mail</h3>
        <p>
          You’ll need to fill out an Application for CHAMPVA Benefits (VA Form
          10-10d).
        </p>
        <va-link
          href="/find-forms/about-form-10-10d/"
          text="Get VA Form 10-10d to download"
        />
        <p>
          Mail your completed application and supporting documents to this
          address:
        </p>
        {CHAMPVA_ELIGIBILITY_ADDRESS}
        <h3>Option 3: By fax</h3>
        <p>
          You’ll need to fill out an Application for CHAMPVA Benefits (VA Form
          10-10d).
        </p>
        <va-link
          href="/find-forms/about-form-10-10d/"
          text="Get VA Form 10-10d to download"
        />
        <p>
          Fax your completed application and supporting documents to{' '}
          <va-telephone contact={CHAMPVA_FAX_NUMBER} />.
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        You can apply by mail or by fax. You’ll need to fill out an Application
        for CHAMPVA Benefits (VA Form 10-10d).
      </p>
      <a
        className="vads-c-action-link--green"
        href="/find-forms/about-form-10-10d/"
      >
        Get VA Form 10-10d to download
      </a>
      <p>
        Make sure to submit the required supporting documents with your
        application.
      </p>
      <va-link
        href="/health-care/family-caregiver-benefits/champva/#supporting-documents-for-your-application"
        text="Find out what supporting documents you need"
      />
      <h3>
        <strong>Option 1: By mail</strong>
      </h3>
      <p>
        Mail your completed application and supporting documents to this
        address:
      </p>
      {CHAMPVA_ELIGIBILITY_ADDRESS}
      <h3>Option 2: By fax</h3>
      <p>
        Fax your completed application and supporting documents to{' '}
        <va-telephone contact={CHAMPVA_FAX_NUMBER} />.
      </p>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form1010dExtended],
});

export default connect(mapStateToProps)(App);
