import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../ivc-champva/10-7959C/manifest.json';

const baseContent = showLink => (
  <>
    <h3>If you have other health insurance (including Medicare)</h3>
    <p>You’ll need to submit these 2 supporting documents:</p>
    <ul>
      <li>
        A completed CHAMPVA-Other Health Insurance Certification (VA Form
        10-7959c)
        <br />
        {showLink && (
          <va-link
            href="https://www.va.gov/find-forms/about-form-10-7959c/"
            text="Get VA  Form 10-7959c to download"
          />
        )}
      </li>
      <li>
        A copy of the front and back of your health insurance card or Medicare
        card
      </li>
    </ul>
    <p>
      <b>Note:</b> If you have Medicare Part D for prescription coverage, you’ll
      also need to submit a copy of the front and back of your Medicare Part D
      card.
    </p>
  </>
);

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  return formEnabled ? (
    <>
      {baseContent(false)}
      <h4>How to submit your supporting documents</h4>
      <p>You can submit your documents in either of these 2 ways:</p>
      <ul>
        <li>
          <b>Online:</b> You can fill out VA Form 10-7959c and upload copies of
          your cards online.
          <br />
          <VaLinkAction
            href={manifest?.rootUrl}
            text="Start VA Form 10-7979c online"
          />
        </li>
        <li>
          <b>By mail:</b> You can download a PDF of VA Form 10-7959c. Then send
          your completed, signed form and copies of your cards to the address
          listed on the PDF.
          <br />
          <va-link
            href="https://www.va.gov/find-forms/about-form-10-7959c/"
            text="Get VA  Form 10-7959c to download"
          />
        </li>
      </ul>
    </>
  ) : (
    <>{baseContent(true)}</>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form107959c],
});

export default connect(mapStateToProps)(App);
