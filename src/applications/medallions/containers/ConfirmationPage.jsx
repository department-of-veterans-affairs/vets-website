import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import classNames from 'classnames';
import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import {
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';

const PrintThisPage = ({ className = '' }) => {
  const onPrintPageClick = () => {
    window.print();
  };

  return (
    <div
      className={classNames(
        'confirmation-print-this-page-section',
        'screen-only',
        className,
      )}
    >
      <h2 className="vads-u-font-size--h4">Print this confirmation page</h2>
      <p>
        If you’d like to keep a copy of the information on this page, you can
        print it now. You won’t be able to access this page later.
      </p>
      <va-button
        onClick={onPrintPageClick}
        text="Print this page for your records"
      />
    </div>
  );
};

const WhatsNextProcessList = ({
  trackingPrefix,
  className = '',
  item1Header,
  item1Content,
  item1Actions,
  item2Header,
  item2Content,
  item3Header,
  item3Content,
}) => {
  const onCheckVaStatusClick = () => {
    recordEvent({
      event: `${trackingPrefix}confirmation-check-status-my-va`,
    });
  };

  const item1 = (
    <VaProcessListItem
      header={
        item1Header || 'We’ll confirm when we receive your form in our system'
      }
    >
      {item1Content === undefined ? (
        <p>
          This can take up to 30 days. When we receive your form, we’ll update
          the status on My VA.
        </p>
      ) : (
        item1Content
      )}
      {item1Actions === undefined ? (
        <p>
          <va-link
            href="/my-va#benefit-applications"
            onClick={onCheckVaStatusClick}
            text="Check the status of your form on My VA"
          />
        </p>
      ) : (
        item1Actions
      )}
    </VaProcessListItem>
  );

  const item2 = (
    <VaProcessListItem
      header={item2Header || 'We’ll review your form'}
      className="vads-u-margin-bottom--neg2"
    >
      {item2Content === undefined ? (
        <p>
          If we need more information after reviewing your form, we’ll contact
          you.
        </p>
      ) : (
        item2Content
      )}
    </VaProcessListItem>
  );

  const item3 = (
    <VaProcessListItem
      header={item3Header || 'We’ll review your form'}
      className="vads-u-margin-bottom--neg2"
    >
      {item3Content === undefined ? (
        <p>
          If we need more information after reviewing your form, we’ll contact
          you.
        </p>
      ) : (
        item3Content
      )}
    </VaProcessListItem>
  );

  // Add additional customization as needed
  return (
    <div
      className={classNames(
        'confirmation-whats-next-process-list-section',
        className,
      )}
    >
      <h2>What to expect</h2>
      <VaProcessList>
        {item1}
        {item2}
        {item3}
      </VaProcessList>
    </div>
  );
};

const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const { formConfig } = props?.route;
  const submitDate = submission?.timestamp || submission?.submittedAt;
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || 'N/A';

  useEffect(() => {
    scrollToTop('topScrollElement');
    focusElement('.confirmation-page-title');
  }, []);

  return (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={formConfig}
      pdfUrl={
        submission?.response?.pdfUrl ||
        'https://www.va.gov/vaforms/va/pdf/VA%20Form%2040-10007.pdf'
      }
    >
      <ConfirmationView.SubmissionAlert
        title="We sent your application to the cemetery"
        content={`Your confirmation number is ${confirmationNumber}`}
        actions={null}
      />
      <ConfirmationView.SavePdfDownload
        title="Save a copy of your application"
        content="If you’d like a PDF copy of your completed application, you can download it."
      />
      <ConfirmationView.ChapterSectionCollection header="Information you submitted on this application" />
      <PrintThisPage />
      <WhatsNextProcessList
        item1Header="We’ll send your application to the Veteran’s cemetery"
        item1Content={
          <>
            <p>
              We’ll ask the representative from the Veteran’s cemetery to review
              and sign your application. They’ll also need to provide a delivery
              address for the medallion.
            </p>
            <p>
              They must sign it before your application expires on{' '}
              {new Date(
                new Date(submitDate).setDate(
                  new Date(submitDate).getDate() + 30,
                ),
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              .
            </p>
          </>
        }
        item1Actions={null}
        item2Header="We’ll review your application"
        item2Content={
          <p>
            If we need more information about your application, we’ll contact
            you.
            <p>
              If we don’t approve your application, we’ll mail you a letter with
              our decision.
            </p>
            <p>This can take up to 30 days.</p>
          </p>
        }
        item3Header="We’ll mail the medallion"
        item3Content={
          <>
            <p>
              If we approve your application, we’ll send the medallion to the
              delivery address provided by the representative from the Veteran’s
              cemetery.
            </p>
            <p>This can take up to 60 days.</p>
          </>
        }
      />
      <h2>If you need to submit supporting documents</h2>
      <p className="mail-or-fax-message">
        You can mail your supporting documents to this address:
      </p>
      <p className="va-address-block">
        NCA FP Evidence Intake Center <br />
        P.O. Box 5237
        <br />
        Janesville, WI 53547
        <br />
      </p>
      <p>
        Or, you can fax your supporting documents to{' '}
        <va-telephone contact="8004557143" />.
      </p>
      <p>
        <strong>Note: </strong>
        Don’t submit your original documents by mail. We can’t return them.
        Submit copies of your documents only.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/supporting-forms-for-claims/"
          text="Learn more about the supporting documents you can submit"
        />
      </p>
      <h2>Resources and support</h2>
      <p>
        Check our resources and support section for answers to common questions.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/resources/"
          text="Go to resources and support section on VA.gov"
        />
      </p>
      <ConfirmationView.GoBackLink />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
export { ConfirmationPage };
