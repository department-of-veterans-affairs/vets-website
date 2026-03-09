import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import {
  VaLinkAction,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const PrintThisConfirmationPage = () => {
  const onPrintPageClick = () => {
    window.print();
  };
  return (
    <div className="confirmation-print-this-page-section screen-only vads-u-margin-bottom--8">
      <h2 className="vads-u-font-size--h4 vads-u-margin-top--0 vads-u-margin-bottom--2">
        Print this confirmation page
      </h2>

      <p>
        If you’d like to keep a copy of the information on this page, you can
        print it now.
      </p>

      <va-button
        onClick={onPrintPageClick}
        text="Print this page for your records"
      />
    </div>
  );
};

const WhatToExpect = () => (
  <div className="confirmation-whats-next-process-list-section vads-u-margin-top--0 vads-u-margin-bottom--3">
    <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
      What to expect
    </h2>

    <VaProcessList>
      <VaProcessListItem header="We’ll confirm when we are reviewing your request">
        <p>
          A status will be displayed on the COE status page to let you know when
          your request is in review. The review should take about 5 days.
        </p>
      </VaProcessListItem>

      <VaProcessListItem header="We’ll let you know if we need additional documentation">
        <p>
          In some cases you may need to upload documents before we can make a
          decision on your COE request. We’ll also provide additional updates on
          the VA home loan COE status page.
        </p>
      </VaProcessListItem>

      <VaProcessListItem header="We’ll provide a decision">
        <p>
          You’ll receive an email about your eligibility and how to get your COE
          if you qualify. You will be able to download your COE on the COE
          application page or from the VA home loan COE status page.
        </p>
      </VaProcessListItem>
    </VaProcessList>
  </div>
);

const CheckStatus = ({ statusURL }) => (
  <div>
    <h2 className="vads-u-margin-top--0">
      How can I check the status of my request?
    </h2>
    <p>You can check the status of your request online.</p>

    <p className="vads-u-margin-top--3 vads-u-margin-bottom--5">
      <strong>Note:</strong> If it’s been more than 5 days since you submitted
      your request and you haven’t received a response, you can call us at{' '}
      <va-telephone contact="8778273702" /> (TTY:
      <va-telephone contact="711" tty />
      ).
    </p>

    <VaLinkAction href={statusURL} text="Check the status of your request" />
  </div>
);

CheckStatus.propTypes = {
  statusURL: PropTypes.string.isRequired,
};

export const ConfirmationPage2 = ({ route }) => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || null;
  const confirmationNumber = submission?.response?.confirmationNumber || '';
  const alertTitle = `Request submission started${
    isValid(submitDate) ? ` on ${format(submitDate, 'MMMM d, yyyy')}` : ''
  }`;
  const statusURL =
    getAppUrl('coe-status') ||
    '/housing-assistance/home-loans/check-coe-status/your-coe';

  return (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={route?.formConfig}
      pdfUrl={submission?.response?.pdfUrl}
      devOnly={{ showButtons: true }}
    >
      <ConfirmationView.SubmissionAlert
        title={alertTitle}
        content={
          <>
            <p>Your submission is in progress.</p>

            <p>
              After we receive your request, we’ll review your information and
              notify you by email on how to get your COE.
            </p>
          </>
        }
        actions={
          <VaLinkAction
            href={statusURL}
            text="Check the status of your COE request"
          />
        }
      />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection
        collapsible
        className="vads-u-margin-bottom--5"
      />
      <PrintThisConfirmationPage />
      <WhatToExpect />
      <CheckStatus statusURL={statusURL} />
      <ConfirmationView.HowToContact />
      <ConfirmationView.GoBackLink text="Go back to VA.gov" />

      <ConfirmationView.NeedHelp />
    </ConfirmationView>
  );
};
ConfirmationPage2.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};
export default ConfirmationPage2;
