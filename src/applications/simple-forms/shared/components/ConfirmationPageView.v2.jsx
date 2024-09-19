import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import scrollTo from 'platform/utilities/ui/scrollTo';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  VaAccordion,
  VaAccordionItem,
  VaAlert,
  VaLinkAction,
  VaProcessList,
  VaProcessListItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  createPageListByChapter,
  getActiveChapters,
  getActiveExpandedPages,
} from '~/platform/forms-system/exportsFile';
import { PropTypes } from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import GetFormHelp from './GetFormHelp';
import { ChapterSectionCollection } from './confirmationPageViewHelpers';

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

export const ConfirmationPageView = props => {
  const alertRef = useRef(null);
  const {
    confirmationNumber,
    formConfig,
    pagesFromState,
    pdfUrl,
    submitDate,
  } = props;

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

  const form = useSelector(state => state.form);
  const formData = form.data;
  const chapterNames = getActiveChapters(formConfig, formData);
  const pagesByChapter = createPageListByChapter(formConfig);

  const chapters = useSelector(state =>
    chapterNames.map(chapterName => {
      const pages = pagesByChapter[chapterName];
      const expandedPages = getActiveExpandedPages(pages, formData);
      const chapterFormConfig = formConfig.chapters[chapterName];

      return {
        expandedPages: expandedPages.map(
          page =>
            page.appStateSelector
              ? { ...page, appStateData: page.appStateSelector(state) }
              : page,
        ),
        formConfig: chapterFormConfig,
        name: chapterName,
      };
    }),
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
          href="/my-va"
          text="Check the status of your form on My VA"
          onClick={onCheckVaStatusClick}
        />
      </VaAlert>
      <div className="print-only">
        <ChapterSectionCollection
          chapters={chapters}
          formData={formData}
          formConfig={formConfig}
          pagesFromState={pagesFromState}
        />
      </div>
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
        <VaAccordion
          bordered
          open-single
          uswds
          className="vads-u-margin-top--2"
        >
          <VaAccordionItem
            header="Information you submitted on this form"
            id="info"
            bordered
            uswds
          >
            <ChapterSectionCollection
              chapters={chapters}
              formData={formData}
              formConfig={formConfig}
              pagesFromState={pagesFromState}
            />
          </VaAccordionItem>
        </VaAccordion>
      </div>
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
        <h2>What to expect next</h2>
        <VaProcessList>
          <VaProcessListItem
            header="We’ll confirm that we’ve received your form"
            active
          >
            <p>
              This can take up to 10 days. When we receive your form, we’ll
              update the status on My VA.
            </p>
            <p>
              <a href="/my-va" onClick={onCheckVaStatusClick}>
                Check the status of your form on My VA
              </a>
            </p>
          </VaProcessListItem>
          <VaProcessListItem header="We’ll review your form">
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
          Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (TTY:{' '}
          <va-telephone contact={CONTACTS[711]} />) We’re here Monday through
          Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        <p>
          Or you can ask us a question online through Ask VA. Select the
          category and topic for the VA benefit this form is related to.
        </p>
        <p className="vads-u-margin-bottom--4">
          <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
        </p>
        <p className="screen-only">
          <a
            className="vads-c-action-link--green vads-u-margin-bottom--4"
            href="/"
          >
            Go back to VA.gov homepage
          </a>
        </p>
      </div>
      <div className="help-footer-box">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};

ConfirmationPageView.propTypes = {
  confirmationNumber: PropTypes.string.isRequired,
  formConfig: PropTypes.object.isRequired,
  pagesFromState: PropTypes.object.isRequired,
  submitDate: PropTypes.object.isRequired,
  pdfUrl: PropTypes.string,
};
