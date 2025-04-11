import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../ivc-champva/10-7959a/manifest.json';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import { CHAMPVA_PHONE_NUMBER } from '../../../ivc-champva/shared/constants';

const baseContent = (
  <>
    <p>You can file your claim by mail.</p>
    <p>
      You’ll need to include a completed CHAMPVA Claim Form (VA Form 10-7959A)
      and your supporting documents. Keep reading to find the supporting
      documents you need based on the type of claim.
    </p>
    <va-link
      href="https://www.va.gov/find-forms/about-form-10-7959a/"
      text="Get VA Form 10-7959A to download"
    />
    <p>Mail your completed form and supporting documents to this address:</p>
    <p className="va-address-block">
      VHA Office of Integrated Veteran Care
      <br />
      CHAMPVA Claims
      <br />
      PO Box 500
      <br />
      Spring City, PA 19475
      <br />
    </p>
    <p>
      <strong>Note:</strong> We can only scan one side of each document. If any
      of your documents are double-sided, you’ll need to include photocopies of
      the backs of those documents with your claim.
    </p>
  </>
);

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  return formEnabled ? (
    <>
      <h3>
        <strong>Option 1: Online</strong>
      </h3>
      <p>You can file your claim online now.</p>
      <a className="vads-c-action-link--blue" href={manifest?.rootUrl}>
        Submit your CHAMPVA claim online
      </a>
      <p>
        If you need help filing your claim, call us at{' '}
        <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 7:30 p.m. ET.
      </p>
      <h3>
        <strong>Option 2: By mail</strong>
      </h3>
      {baseContent}
    </>
  ) : (
    <>{baseContent}</>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form107959a],
});

export default connect(mapStateToProps)(App);
