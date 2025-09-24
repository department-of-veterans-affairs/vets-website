import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../ivc-champva/10-7959f-2/manifest.json';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import {
  FMP_ADDRESS,
  FMP_CANADA_ADDRESS,
  FMP_FAX_NUMBER,
  FMP_CANADA_FAX_NUMBER,
} from '../../../ivc-champva/shared/constants';

const introText = (
  <p>
    You’ll need to fill out an FMP Claim Cover Sheet (VA Form 10-7959f-2) and
    provide supporting documents. Keep reading to find out the supporting
    documents you need based on the type of care.
  </p>
);

const downloadLink = (
  <va-link
    href="https://www.va.gov/find-forms/about-form-10-7959f-2/"
    text="Get VA Form 10-7959f-2 to download"
  />
);

const emailOption = (
  <>
    <p>
      Email us your completed VA Form 10-7959f-2 and supporting documents to{' '}
      <a href="mailto:HAC.FMP@va.gov">HAC.FMP@va.gov</a>.
    </p>
  </>
);

const mailOption = (
  <>
    <p>
      Mail your completed VA Form 10-7959f-2 and supporting documents to this
      address (for care in any country except for Canada):
    </p>

    {FMP_ADDRESS}

    <p>
      If you got care in Canada, mail your completed VA Form 10-7959f-2 and
      supporting documents to this address:
    </p>

    {FMP_CANADA_ADDRESS}
  </>
);

const faxOption = (
  <>
    <p>
      Fax your completed VA Form 10-7959f-2 and supporting documents to{' '}
      <va-telephone contact={FMP_FAX_NUMBER} /> (for care in any country except
      for Canada).
    </p>
    <p>
      If you got care in Canada, fax your completed VA Form 10-7959f-2 and
      supporting documents to <va-telephone contact={FMP_CANADA_FAX_NUMBER} />.
    </p>
  </>
);

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>You can file a claim in any of these 4 ways.</p>

        <h3>Option 1: Online</h3>
        <p>You can file a claim online now.</p>
        <a className="vads-c-action-link--blue" href={manifest?.rootUrl}>
          File an FMP claim online
        </a>

        <h3>Option 2: By email</h3>
        {introText}
        {downloadLink}
        {emailOption}
        <h3>Option 3: By mail</h3>
        {introText}
        {downloadLink}
        {mailOption}
        <h3>Option 4: By fax</h3>
        {introText}
        {downloadLink}
        {faxOption}
      </>
    );
  }

  return (
    <>
      <p>
        You can file your claim by email, mail or fax. The address or fax number
        for your claim depends on the country where you got care.
      </p>
      <p>
        You’ll need to include a completed FMP Claim Cover Sheet (VA Form
        10-7959f-2) and your supporting documents. Keep reading to find out the
        supporting documents you need based on the type of care.
      </p>
      {downloadLink}
      <h3>Option 1: By email</h3>
      {emailOption}
      <h3>Option 2: By mail</h3>
      {mailOption}
      <h3>Option 3: By fax</h3>
      {faxOption}
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
