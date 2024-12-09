import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaAlert,
  VaLinkAction,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { useConfirmation } from './Provider';
import { ChapterSectionCollection } from './ChapterSectionCollection';

export const HowToContact = ({ className = '', title, content }) => {
  const titleText = title || 'How to contact us if you have questions';
  const contentBody = content || (
    <>
      <p>
        Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone tty="true" contact={CONTACTS[711]} />) We’re here Monday
        through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p>
        Or you can ask us a question online through Ask VA. Select the category
        and topic for the VA benefit this form is related to.
      </p>
      <p>
        <va-link
          href="https://ask.va.gov/"
          text="Contact us online through Ask VA"
        />
      </p>
    </>
  );

  return (
    <div
      className={classNames('confirmation-how-to-contact-section', className)}
    >
      <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
        {titleText}
      </h2>
      {contentBody}
    </div>
  );
};

HowToContact.propTypes = {
  className: PropTypes.string,
  content: PropTypes.node,
  title: PropTypes.string,
};

export const NeedHelp = ({ className, content }) => {
  const contentBody = content || (
    <>
      <p className="help-talk">
        <strong>If you have trouble using this online form,</strong> call us at{' '}
        <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ). We&rsquo;re here 24/7.
      </p>
      <p className="help-talk">
        <strong>
          If you need help gathering your information or filling out your form,
        </strong>{' '}
        you can appoint a VA accredited representative.
      </p>
      <va-link
        href="https://www.va.gov/get-help-from-accredited-representative/"
        text="Get help filling out a form"
      />
    </>
  );

  return (
    <div
      className={classNames(
        'help-footer-box',
        'confirmation-need-help-section',
        className || 'vads-u-margin-top--6',
      )}
    >
      <h2 className="help-heading">Need help?</h2>
      {contentBody}
    </div>
  );
};

NeedHelp.propTypes = {
  className: PropTypes.string,
  content: PropTypes.node,
};

export const GoBackLink = ({ className, text, href }) => {
  return (
    <div
      className={classNames(
        'confirmation-go-back-link-section',
        'screen-only',
        className || 'vads-u-margin-top--4',
      )}
    >
      <va-link-action
        href={href || '/'}
        text={text || 'Go back to VA.gov homepage'}
        type="secondary"
      />
    </div>
  );
};

GoBackLink.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  text: PropTypes.string,
};

export const WhatsNextProcessList = ({
  trackingPrefix,
  className = '',
  item1Header,
  item1Content,
  item1Actions,
  item2Header,
  item2Content,
}) => {
  const onCheckVaStatusClick = () => {
    recordEvent({
      event: `${trackingPrefix}confirmation-check-status-my-va`,
    });
  };

  const item1 = (
    <VaProcessListItem
      header={item1Header || 'Now, we’ll confirm that we’ve received your form'}
      active
    >
      {item1Content || (
        <p>
          This can take up to 30 days. When we receive your form, we’ll update
          the status on My VA.
        </p>
      )}
      {item1Actions || (
        <p>
          <va-link
            href="/my-va#benefit-applications"
            onClick={onCheckVaStatusClick}
            text="Check the status of your form on My VA"
          />
        </p>
      )}
    </VaProcessListItem>
  );

  const item2 = (
    <VaProcessListItem
      pending
      header={item2Header || 'Next, we’ll review your form'}
      className="vads-u-margin-bottom--neg2"
    >
      {item2Content || (
        <p>
          If we need more information after reviewing your form, we’ll contact
          you.
        </p>
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
      </VaProcessList>
    </div>
  );
};

WhatsNextProcessList.propTypes = {
  className: PropTypes.string,
  item1Actions: PropTypes.node,
  item1Content: PropTypes.node,
  item1Header: PropTypes.string,
  item2Content: PropTypes.node,
  item2Header: PropTypes.string,
  trackingPrefix: PropTypes.string,
};

export const WhatsNextProcessListWithContext = ({
  className,
  item1Actions,
  item1Content,
  item1Header,
  item2Content,
  item2Header,
}) => {
  const { formConfig } = useConfirmation();

  return (
    <WhatsNextProcessList
      trackingPrefix={formConfig.trackingPrefix}
      className={className}
      item1Actions={item1Actions}
      item1Content={item1Content}
      item1Header={item1Header}
      item2Content={item2Content}
      item2Header={item2Header}
    />
  );
};

WhatsNextProcessListWithContext.propTypes = {
  className: PropTypes.string,
  item1Actions: PropTypes.node,
  item1Content: PropTypes.node,
  item1Header: PropTypes.string,
  item2Content: PropTypes.node,
  item2Header: PropTypes.string,
};

export const SavePdfDownload = ({
  pdfUrl,
  trackingPrefix,
  className,
  formId,
}) => {
  const onClick = () => {
    recordEvent({
      event: `${trackingPrefix}confirmation-pdf-download`,
    });
  };

  return pdfUrl ? (
    <div
      className={classNames(
        'confirmation-save-pdf-download-section',
        'screen-only',
        className || 'vads-u-margin-bottom--4',
      )}
    >
      <h2>Save a copy of your form</h2>
      <p>If you’d like a copy of your completed form, you can download it.</p>
      <va-link
        download
        filetype="PDF"
        href={pdfUrl}
        onClick={onClick}
        text={`Download a copy of your VA Form ${formId}`}
      />
    </div>
  ) : null;
};

SavePdfDownload.propTypes = {
  className: PropTypes.string,
  formId: PropTypes.string,
  pdfUrl: PropTypes.string,
  trackingPrefix: PropTypes.string,
};

export const SavePdfDownloadWithContext = ({ className }) => {
  const { pdfUrl, formConfig } = useConfirmation();

  return (
    <SavePdfDownload
      pdfUrl={pdfUrl}
      trackingPrefix={formConfig.trackingPrefix}
      className={className}
      formId={formConfig.formId}
    />
  );
};

SavePdfDownloadWithContext.propTypes = {
  className: PropTypes.string,
};

export const PrintOnlyHeader = () => {
  return (
    <div className="confirmation-print-only-header-section vads-u-margin-bottom--2 print-only">
      <img
        src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
        alt="VA logo"
        width="300"
      />
    </div>
  );
};

export const PrintThisPage = ({ className = '' }) => {
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
        print it now.
      </p>
      <va-button
        onClick={onPrintPageClick}
        text="Print this page for your records"
      />
    </div>
  );
};

PrintThisPage.propTypes = {
  className: PropTypes.string,
};

export const SubmissionAlert = ({
  submitDate,
  confirmationNumber,
  trackingPrefix,
  className,
  status = 'success',
  title,
  content,
  actions,
}) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  const onCheckVaStatusClick = () => {
    recordEvent({
      event: `${trackingPrefix}confirmation-check-status-my-va`,
    });
  };

  const titleText =
    title ||
    `Form submission started${
      isValid(submitDate) ? ` on ${format(submitDate, 'MMMM d, yyyy')}` : ''
    }`;

  const contentBody = content || (
    <>
      <p>Your submission is in progress.</p>
      <p>
        It can take up to 30 days for us to receive your form.
        {confirmationNumber &&
          ` Your confirmation number is ${confirmationNumber}.`}
      </p>
    </>
  );

  const actionsBody = actions || (
    <VaLinkAction
      href="/my-va#benefit-applications"
      text="Check the status of your form on My VA"
      onClick={onCheckVaStatusClick}
    />
  );

  return (
    <VaAlert
      uswds
      status={status}
      ref={alertRef}
      className={classNames(
        'confirmation-submission-alert-section',
        className || 'vads-u-margin-bottom--4',
      )}
    >
      <h2 slot="headline">{titleText}</h2>
      {contentBody}
      {actionsBody}
    </VaAlert>
  );
};

SubmissionAlert.propTypes = {
  actions: PropTypes.node,
  className: PropTypes.string,
  confirmationNumber: PropTypes.string,
  content: PropTypes.node,
  status: PropTypes.string,
  submitDate: PropTypes.instanceOf(Date),
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
};

export const SubmissionAlertWithContext = ({
  className,
  status,
  title,
  content,
  actions,
}) => {
  const { submitDate, confirmationNumber, formConfig } = useConfirmation();

  return (
    <SubmissionAlert
      className={className}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      trackingPrefix={formConfig.trackingPrefix}
      status={status}
      title={title}
      content={content}
      actions={actions}
    />
  );
};

SubmissionAlertWithContext.propTypes = {
  actions: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.node,
  status: PropTypes.string,
  title: PropTypes.string,
};

// Information you submitted on this form
export const ChapterSectionCollectionWithContext = ({
  header,
  className,
  collapsible,
}) => {
  const { formConfig } = useConfirmation();

  return (
    <ChapterSectionCollection
      formConfig={formConfig}
      header={header}
      className={className}
      collapsible={collapsible}
    />
  );
};

ChapterSectionCollectionWithContext.propTypes = {
  className: PropTypes.string,
  collapsible: PropTypes.bool,
  header: PropTypes.string,
};

export { ChapterSectionCollection } from './ChapterSectionCollection';
