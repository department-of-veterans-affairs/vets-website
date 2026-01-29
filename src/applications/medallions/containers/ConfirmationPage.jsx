import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { useSelector } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';

export const ConfirmationPage = () => {
  const alertRef = useRef(null);
  const form = useSelector(state => state.form || {});
  const { submission, formId, data = {} } = form;
  const { fullName } = data;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>

      <va-alert status="success" ref={alertRef}>
        <h2 slot="headline">Your application has been submitted</h2>
      </va-alert>

      <p>We may contact you for more information or documents.</p>
      <p className="screen-only">Please print this page for your records.</p>
      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          1330M Apply for a medallion in a private cemetery Claim{' '}
          <span className="vads-u-font-weight--normal">(Form {formId})</span>
        </h3>
        {fullName ? (
          <span>
            for {fullName.first} {fullName.middle} {fullName.last}
            {fullName.suffix ? `, ${fullName.suffix}` : null}
          </span>
        ) : null}

        {confirmationNumber ? (
          <>
            <h4>Confirmation number</h4>
            <p>{confirmationNumber}</p>
          </>
        ) : null}

        {isValid(submitDate) ? (
          <p>
            <strong>Date submitted</strong>
            <br />
            <span>{format(submitDate, 'MMMM d, yyyy')}</span>
          </p>
        ) : null}

        <va-button onClick={window.print} text="Print this for your records" />
      </div>
      <a className="vads-c-action-link--green vads-u-margin-bottom--4" href="/">
        Go back to VA.gov
      </a>

      {/* <div className="help-footer-box">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div> */}
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

export default ConfirmationPage;
