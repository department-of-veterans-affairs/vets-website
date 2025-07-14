import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { useSelector } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import GetFormHelp from '../components/GetFormHelp';

export const ConfirmationPage = () => {
  const alertRef = useRef(null);
  const form = useSelector(state => state.form || {});
  const veteranEmail = useSelector(state => {
    return state.user?.profile?.email || '';
  });
  const { submission, data = {} } = form;
  const { fullName, selectedDebts = [] } = data;
  const submitDate = submission?.timestamp;

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
        <h2 slot="headline">Your dispute submission is in progress</h2>
        <p>
          When we receive your form, we’ll mail you a letter and send an email
          to <strong>{veteranEmail}</strong> to confirm we have it.
          <br />
          <br />
          It may take up to 30 days to process your dispute.
        </p>
      </va-alert>

      <div className="inset">
        <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
          Your submission information
        </h3>
        {fullName ? (
          <span>
            for {fullName.first} {fullName.middle} {fullName.last}
            {fullName.suffix ? `, ${fullName.suffix}` : null}
          </span>
        ) : null}

        <h4>Requested Dispute</h4>
        <ul>
          {selectedDebts.map(item => (
            <li key={item.compositeDebtId}>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        {isValid(submitDate) ? (
          <p>
            <strong>Date submitted</strong>
            <br />
            <span>{format(submitDate, 'MMMM d, yyyy')}</span>
          </p>
        ) : null}

        <p>
          <strong>Confirmation for your records </strong>
          <br />
          <span>You can print this confirmation page for your records.</span>
        </p>
        <va-button onClick={window.print} text="Print this for your records" />
      </div>
      <h2>What to expect next</h2>
      <p>You don’t need to do anything else at this time</p>
      <p>
        After we receive your dispute form, we’ll review your dispute. You will
        receive an email and a letter in the mail confirming receipt and letting
        you know whether you need to continue paying.Then we’ll mail you a
        letter with our decision. If you have questions about your dispute, call
        us at <va-telephone contact={CONTACTS.DMC} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
      <a className="vads-c-action-link--green vads-u-margin-bottom--4" href="/">
        Go back to VA.gov
      </a>
      <va-need-help>
        <div slot="content">
          <GetFormHelp />
        </div>
      </va-need-help>
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
