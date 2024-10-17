import React, { useEffect, useRef, useState } from 'react';
import { format, isValid } from 'date-fns';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaAlert,
  VaLinkAction,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { PropTypes } from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';
import GetFormHelp from './GetFormHelp';
import {
  ChapterSectionCollection,
  useDevOnlyButtons,
} from './confirmationPageViewHelpers';

const PdfDownloadLink = ({ url, trackingPrefix }) => {
  const onClick = () => {
    recordEvent({
      event: `${trackingPrefix}confirmation-pdf-download`,
    });
  };

  return (
    <va-link
      download
      filetype="PDF"
      href={url}
      onClick={onClick}
      text="Download a copy of your VA Form"
    />
  );
};

/**
 * @param {Object} props
 * @param {Object} props.formConfig
 * @param {{
 *  showButtons: boolean
 *  simulatedFormData: Object
 * }} props.devOnly
 * @param {string} props.pdfUrl
 * @param {string} props.confirmationNumber
 * @param {Date} props.submitDate
 */
export const ConfirmationPageView = props => {
  const alertRef = useRef(null);
  const { formConfig, devOnly } = props;
  const { form } = useSelector(state => state);
  const [pdfUrl, setPdfUrl] = useState(props.pdfUrl);
  const [confirmationNumber, setConfirmationNumber] = useState(
    props.confirmationNumber,
  );
  const [submitDate, setSubmitDate] = useState(props.submitDate || null);

  const DevOnlyButtons = useDevOnlyButtons({
    formData: form?.data,
    mockData: devOnly?.simulatedFormData,
    setPdfUrl,
    setConfirmationNumber,
    setSubmitDate,
  });

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

  const onPrintPageClick = () => {
    window.print();
  };

  const onCheckVaStatusClick = () => {
    recordEvent({
      event: `${formConfig.trackingPrefix}confirmation-check-status-my-va`,
    });
  };

  return (
    <div>
      {devOnly?.showButtons &&
        (environment.isLocalhost() || environment.isDev()) &&
        !environment.isTest() && <DevOnlyButtons />}
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <VaAlert
        uswds
        status="success"
        ref={alertRef}
        className="vads-u-margin-bottom--4"
      >
        <h2 slot="headline">
          Form submission started on{' '}
          {isValid(submitDate) && format(submitDate, 'MMMM d, yyyy')}
        </h2>
        <p>Your submission is in progress.</p>
        <p>
          It can take up to 10 days for us to receive your form.{' '}
          {confirmationNumber &&
            `Your
          confirmation number is ${confirmationNumber}.`}
        </p>
        <VaLinkAction
          href="/my-va#benefit-applications"
          text="Check the status of your form on My VA"
          onClick={onCheckVaStatusClick}
        />
      </VaAlert>
      <div className="screen-only">
        {pdfUrl && (
          <>
            <h2>Save a copy of your form</h2>
            <p>
              If you’d like a copy of your completed form, you can download it.
            </p>
            <PdfDownloadLink
              url={pdfUrl}
              trackingPrefix={formConfig.trackingPrefix}
            />
          </>
        )}
      </div>
      <ChapterSectionCollection
        formConfig={formConfig}
        header="Information you submitted on this form"
      />
      <div className="screen-only">
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
      <div>
        <h2>What to expect</h2>
        <VaProcessList>
          <VaProcessListItem
            header="Now, we’ll confirm that we’ve received your form"
            active
          >
            <p>
              This can take up to 10 days. When we receive your form, we’ll
              update the status on My VA.
            </p>
            <p>
              <a
                href="/my-va#benefit-applications"
                onClick={onCheckVaStatusClick}
              >
                Check the status of your form on My VA
              </a>
            </p>
          </VaProcessListItem>
          <VaProcessListItem pending header="Next, we’ll review your form">
            <p>
              If we need more information after reviewing your form, we’ll
              contact you.
            </p>
          </VaProcessListItem>
        </VaProcessList>
      </div>
      <div className="vads-u-margin-bottom--6">
        <h2 className="vads-u-font-size--h2 vads-u-font-family--serif">
          How to contact us if you have questions
        </h2>
        <p>
          Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone tty="true" contact={CONTACTS[711]} />) We’re here Monday
          through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <p>
          Or you can ask us a question online through Ask VA. Select the
          category and topic for the VA benefit this form is related to.
        </p>
        <p className="vads-u-margin-bottom--4">
          <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
        </p>

        <va-link-action
          href="/"
          text="Go back to VA.gov homepage"
          type="secondary"
        />
      </div>
      <div className="help-footer-box">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};

ConfirmationPageView.propTypes = {
  confirmationNumber: PropTypes.string,
  devOnly: PropTypes.shape({
    showButtons: PropTypes.bool,
    simulatedFormData: PropTypes.object,
  }),
  formConfig: PropTypes.object,
  pdfUrl: PropTypes.string,
  submitDate: PropTypes.any,
};

PdfDownloadLink.propTypes = {
  trackingPrefix: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
