import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { selectProfile } from 'platform/user/selectors';
import { scrollToTop } from 'platform/utilities/scroll';

import { getFullName } from '../../shared/utils';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { userFullName = {} } = useSelector(selectProfile);
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || Date.now();
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  useEffect(() => {
    scrollToTop();
  }, []);

  const alertContent = (
    <>
      <p>Your submission is in progress.</p>
      <p>
        It can take up to 10 days for us to receive your form.
        {confirmationNumber &&
          ` Your confirmation number is ${confirmationNumber}.`}
      </p>
    </>
  );

  const step1Content = (
    <p>
      This can take up to 10 days. When we receive your form, we’ll update the
      status on My VA.
    </p>
  );

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission.response?.pdfUrl}
    >
      <ConfirmationView.SubmissionAlert content={alertContent} />
      <va-summary-box>
        <h3 slot="headline">Your submission information</h3>
        <p>
          <strong>Veteran’s name</strong>
        </p>
        <p className="dd-privacy-hidden" data-dd-action-name="Veteran's name">
          {getFullName(userFullName)}
        </p>
        <p>
          <strong>Date submitted</strong>
        </p>
        <p data-testid="dateSubmitted">{format(submitDate, 'MMMM d, yyyy')}</p>
        {confirmationNumber && (
          <>
            <p>
              <strong>Confirmation number</strong>
            </p>
            <p>{confirmationNumber}</p>
          </>
        )}
        <va-button
          text="Print this page for your records"
          onClick={() => {
            window.print();
          }}
        />
      </va-summary-box>
      <ConfirmationView.WhatsNextProcessList item1Content={step1Content} />
      <ConfirmationView.HowToContact />
      <p>
        <strong>If you don’t hear back from us about your claim,</strong> don’t
        file another claim. Contact us online or call us instead.
      </p>

      <ConfirmationView.GoBackLink text="Go back to VA.gov" />

      <va-need-help class="vads-u-margin-y--6">
        <div slot="content">
          For help filling out this form, or if the form isn’t working right,
          please call VA Benefits and Services at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact="711" tty />
          ).
        </div>
      </va-need-help>
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
