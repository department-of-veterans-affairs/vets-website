import React from 'react';
import PropTypes from 'prop-types';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const InfoAlert = ({ highLowResults, fullState }) => (
  <>
    <va-alert-expandable
      trigger="Need help understanding your results?"
      class="no-print vads-u-margin-y--1p5"
      status="info"
    >
      {highLowResults && (
        <p className="vads-u-padding-bottom--2">
          If your results are outside the reference range (the expected range
          for that test), your results may include a word like "high" or "low."
          But this doesn’t automatically mean you have a health problem.
        </p>
      )}
      <p className="vads-u-padding-bottom--2">
        Your provider will review your results. If you need to do anything, your
        provider will contact you.
      </p>
      <p className="vads-u-padding-bottom--2">
        If you have any questions, send a message to the care team that ordered
        this test.
      </p>
      <p className="vads-u-padding-bottom--2">
        <a
          href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'compose-message')}
          rel="noreferrer" // check dis
        >
          Compose a message on the My HealtheVet website
        </a>
      </p>
      <p>
        <strong>Note:</strong> If you have questions about more than 1 test
        ordered by the same care team, send 1 message with all of your
        questions.
      </p>
    </va-alert-expandable>
  </>
);

export default InfoAlert;

InfoAlert.propTypes = {
  fullState: PropTypes.object,
  highLowResults: PropTypes.object,
};
