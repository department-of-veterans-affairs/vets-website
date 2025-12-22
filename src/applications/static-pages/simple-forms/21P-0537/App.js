import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import manifest from '../../../simple-forms/21p-0537/manifest.json';

const CLAIM_STATUS_TEXT =
  'You can check the status of your claim online. The timeline listed there may vary based on how complex your claim is.';

const PAYMENT_HISTORY_TEXT =
  'If you get DIC benefits, you can check your payment history online.';

const MARITAL_STATUS_INTRO =
  "If you're a surviving spouse receiving DIC benefits, we'll ask you at times to verify or report changes to your marital status. You only need to verify your marital status when we specifically ask you to do this.";

const MARITAL_STATUS_MAIL_TEXT =
  'You may have already received a Marital Status Questionnaire (VA Form 21P-0537) from us in the mail. If you did, you can complete the form and send it back to us. If you need another copy of this form, you can get another copy to download and fill out:';

const CLAIM_STATUS_LINK_URL =
  'https://www.va.gov/check-your-va-claim-or-appeal-status';
const CLAIM_STATUS_LINK_TEXT = 'Check your VA claim status';

const PAYMENT_HISTORY_LINK_URL = 'https://www.va.gov/va-payment-history';
const PAYMENT_HISTORY_LINK_TEXT =
  'Find out how to view your VA payment history online';

const FORM_DOWNLOAD_LINK_URL =
  'https://www.va.gov/find-forms/about-form-21p-0537/';
const FORM_DOWNLOAD_LINK_TEXT = 'Get VA Form 21P-0537 to download';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <va-accordion>
        <va-accordion-item
          header="How to check your claim status"
          id="claim-status"
          level="3"
        >
          <p>{CLAIM_STATUS_TEXT}</p>
          <va-link-action
            href={CLAIM_STATUS_LINK_URL}
            text={CLAIM_STATUS_LINK_TEXT}
            type="secondary"
          />
        </va-accordion-item>
        <va-accordion-item
          header="How to check your payment history"
          id="payment-history"
          level="3"
        >
          <p>{PAYMENT_HISTORY_TEXT}</p>
          <va-link
            href={PAYMENT_HISTORY_LINK_URL}
            text={PAYMENT_HISTORY_LINK_TEXT}
          />
        </va-accordion-item>
        <va-accordion-item
          header="What to do if we've asked you to verify your marital status"
          id="verify-marital-status"
          level="3"
        >
          <p>{MARITAL_STATUS_INTRO}</p>
          <p>{MARITAL_STATUS_MAIL_TEXT}</p>
          <va-link
            href={FORM_DOWNLOAD_LINK_URL}
            text={FORM_DOWNLOAD_LINK_TEXT}
          />
          <p>Or, you can verify your marital status online.</p>
          <va-link-action
            href={manifest.rootUrl}
            text="Verify your marital status for DIC benefits"
            type="secondary"
          />
        </va-accordion-item>
      </va-accordion>
    );
  }

  return (
    <va-accordion>
      <va-accordion-item
        header="How to check your claim status"
        id="claim-status"
        level="3"
      >
        <p>{CLAIM_STATUS_TEXT}</p>
        <va-link-action
          href={CLAIM_STATUS_LINK_URL}
          text={CLAIM_STATUS_LINK_TEXT}
          type="secondary"
        />
      </va-accordion-item>
      <va-accordion-item
        header="How to check your payment history"
        id="payment-history"
        level="3"
      >
        <p>{PAYMENT_HISTORY_TEXT}</p>
        <va-link
          href={PAYMENT_HISTORY_LINK_URL}
          text={PAYMENT_HISTORY_LINK_TEXT}
        />
      </va-accordion-item>
      <va-accordion-item
        header="What to do if we've asked you to verify your marital status"
        id="verify-marital-status"
        level="3"
      >
        <p>{MARITAL_STATUS_INTRO}</p>
        <p>{MARITAL_STATUS_MAIL_TEXT}</p>
        <va-link href={FORM_DOWNLOAD_LINK_URL} text={FORM_DOWNLOAD_LINK_TEXT} />
      </va-accordion-item>
    </va-accordion>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form21P0537],
});

export default connect(mapStateToProps)(App);
