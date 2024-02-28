import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PreSubmitNotice = props => {
  const { preSubmitInfo, showError, onSectionComplete, submission } = props;
  const { field, required } = preSubmitInfo;

  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(undefined);
  const formSubmitted = !!submission.status;

  // set section complete value--unset if user navigates away from the page before submitting the form.
  useEffect(
    () => {
      onSectionComplete(accepted);

      return () => {
        onSectionComplete(false);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accepted],
  );

  // set error message status
  useEffect(
    () => {
      const hasError = accepted === true || formSubmitted ? false : showError;
      const message = hasError
        ? 'You must accept the agreement before continuing.'
        : undefined;
      setError(message);
    },
    [accepted, showError, formSubmitted],
  );

  return (
    <>
      <h3>Agreement</h3>
      <p>By submitting this application, you agree to these statements:</p>
      <ul data-testid="hca-agreement-statements">
        <li>
          You’ll pay any VA copays for care or services (including urgent care)
          that may apply, based on your priority group and other factors.
        </li>
        <li>
          You agree that we can contact you at the email, home phone number, and
          mobile phone number you gave us in the application.
        </li>
        <li>
          You agree to the assignment of benefits so we can bill your other
          health insurance or other responsible party for charges of
          nonservice-connected VA medical care or services.
        </li>
        <li>
          You’ve read and accept our privacy policy.{' '}
          <span className="vads-u-display--block">
            <a target="_blank" href="/privacy-policy/">
              Read our privacy policy
              <span className="vads-u-visibility--screen-reader">
                , will open in new tab
              </span>
            </a>
          </span>
        </li>
      </ul>
      <va-additional-info
        trigger="Read more about the assignment of benefits"
        class="vads-u-margin-y--2"
        uswds
      >
        <p>
          I understand that pursuant to 38 U.S.C. Section 1729 and 42 U.S.C.
          2651, the Department of Veterans Affairs (VA) is authorized to recover
          or collect from my health plan (HP) or any other legally responsible
          third party for the reasonable charges of nonservice-connected VA
          medical care or services furnished or provided to me. I hereby
          authorize payment directly to VA from any HP under which I am covered
          (including coverage provided under my spouse’s HP) that is responsible
          for payment of the charges for my medical care, including benefits
          otherwise payable to me or my spouse. Furthermore, I hereby assign to
          the VA any claim I may have against any person or entity who is or may
          be legally responsible for the payment of the cost of medical services
          provided to me by the VA. I understand that this assignment shall not
          limit or prejudice my right to recover for my own benefit any amount
          in excess of the cost of medical services provided to me by the VA or
          any other amount to which I may be entitled. I hereby appoint the
          Attorney General of the United States and the Secretary of Veterans'
          Affairs and their designees as my Attorneys-in-fact to take all
          necessary and appropriate actions in order to recover and receive all
          or part of the amount herein assigned. I hereby authorize the VA to
          disclose, to my attorney and to any third party or administrative
          agency who may be responsible for payment of the cost of medical
          services provided to me, information from my medical records as
          necessary to verify my claim. Further, I hereby authorize any such
          third party or administrative agency to disclose to the VA any
          information regarding my claim.
        </p>
      </va-additional-info>
      <p>
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
      <VaCheckbox
        required={required}
        name={field}
        error={error}
        onVaChange={event => setAccepted(event.target.checked)}
        label="I confirm that I agree to the statements listed here. The information is true and correct to the best of my knowledge and belief. I’ve read and accept the privacy policy."
        uswds
      />
    </>
  );
};

PreSubmitNotice.propTypes = {
  formData: PropTypes.object,
  preSubmitInfo: PropTypes.object,
  showError: PropTypes.bool,
  submission: PropTypes.object,
  onSectionComplete: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    submission: state.form.submission,
  };
};

export default connect(mapStateToProps)(PreSubmitNotice);
