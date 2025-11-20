import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import environment from 'platform/utilities/environment';
import { ChapterSectionCollection } from './ChapterSectionCollection';
import { ConfirmationProvider } from './Provider';
import {
  ChapterSectionCollectionWithContext,
  HowToContact,
  GoBackLink,
  NeedHelp,
  WhatsNextProcessList,
  WhatsNextProcessListWithContext,
  SavePdfDownload,
  SavePdfDownloadWithContext,
  PrintOnlyHeader,
  PrintThisPage,
  SubmissionAlert,
  SubmissionAlertWithContext,
} from './components';
import { useDevOnlyButtons } from './useDevOnlyButtons';

/**
 * Standard Usage:
 * ```jsx
 * <ConfirmationView
 *    submitDate={submitDate}
 *    confirmationNumber={confirmationNumber}
 *    formConfig={formConfig}
 *    pdfUrl={submission.response?.pdfUrl}
 *    devOnly={{
 *      showButtons: true,
 *      mockData,
 *    }}
 *  />
 *
 * // Custom usage:
 * <ConfirmationView
 *    submitDate={submitDate}
 *    confirmationNumber={confirmationNumber}
 *    formConfig={formConfig}
 *    pdfUrl={submission.response?.pdfUrl}
 *    devOnly={{
 *      showButtons: true,
 *      mockData,
 *    }}
 *  >
 *    <ConfirmationView.SubmissionAlert />
 *    <ConfirmationView.SavePdfDownload />
 *    <ConfirmationView.ChapterSectionCollection />
 *    <ConfirmationView.PrintThisPage />
 *    <ConfirmationView.WhatsNextProcessList />
 *    <ConfirmationView.HowToContact />
 *    <ConfirmationView.GoBackLink />
 *    <ConfirmationView.NeedHelp />
 *  </ConfirmationView>
 * ```
 *
 * @param {Object} props
 * @param {Object} props.formConfig
 * @param {Object} props.formConfig.trackingPrefix
 * @param {{
 *   showPageTitles: boolean
 * }} [props.chapterSectionCollection]
 * @param {Object} [props.devOnly]
 * @param {boolean} [props.devOnly.showButtons]
 * @param {Object} [props.devOnly.mockData]
 * @param {string} [props.pdfUrl]
 * @param {string} [props.filename]
 * @param {string} [props.confirmationNumber]
 * @param {Date} [props.submitDate]
 */
export const ConfirmationView = props => {
  const { formConfig, devOnly, children } = props;
  const { form } = useSelector(state => state);
  const [pdfUrl, setPdfUrl] = useState(props.pdfUrl);
  const [filename, setFilename] = useState(props.filename);
  const [confirmationNumber, setConfirmationNumber] = useState(
    props.confirmationNumber,
  );
  const [submitDate, setSubmitDate] = useState(props.submitDate || null);

  useEffect(
    () => {
      setPdfUrl(props.pdfUrl);
      setConfirmationNumber(props.confirmationNumber);
      setSubmitDate(props.submitDate || null);
      setFilename(props.filename);
    },
    [props.pdfUrl, props.confirmationNumber, props.submitDate, props.filename],
  );

  const DevOnlyButtons = useDevOnlyButtons({
    formData: form.data,
    mockData: devOnly?.mockData,
    setPdfUrl,
    setConfirmationNumber,
    setSubmitDate,
    setFilename,
  });

  const contextValue = {
    submitDate,
    confirmationNumber,
    formConfig,
    pdfUrl,
    filename,
    devOnly,
    chapterSectionCollection: props.chapterSectionCollection,
  };

  const showDevButtons =
    devOnly?.showButtons &&
    (environment.isLocalhost() || environment.isDev()) &&
    !environment.isTest();

  // Custom usage:
  if (children) {
    return (
      <ConfirmationProvider value={contextValue}>
        <PrintOnlyHeader />
        {/* children provided:
        <ConfirmationView.SubmissionAlert />
        <ConfirmationView.SavePdfDownload />
        <ConfirmationView.ChapterSectionCollection />
        <ConfirmationView.PrintThisPage />
        <ConfirmationView.WhatsNextProcessList />
        <ConfirmationView.HowToContact />
        <ConfirmationView.GoBackLink />
        <ConfirmationView.NeedHelp />
        */}
        {children}
        {showDevButtons && <DevOnlyButtons />}
      </ConfirmationProvider>
    );
  }

  // Simple usage:
  // <ConfirmationView ... />
  return (
    <div>
      <PrintOnlyHeader />
      <SubmissionAlert
        submitDate={submitDate}
        confirmationNumber={confirmationNumber}
        trackingPrefix={formConfig.trackingPrefix}
      />
      <SavePdfDownload
        pdfUrl={pdfUrl}
        trackingPrefix={formConfig.trackingPrefix}
        formId={formConfig.formId}
        filename={filename}
      />
      <ChapterSectionCollection
        formConfig={formConfig}
        showPageTitles={props.chapterSectionCollection?.showPageTitles}
      />
      <PrintThisPage />
      <WhatsNextProcessList trackingPrefix={formConfig.trackingPrefix} />
      <HowToContact />
      <GoBackLink />
      <NeedHelp />
      {showDevButtons && <DevOnlyButtons />}
    </div>
  );
};

ConfirmationView.propTypes = {
  formConfig: PropTypes.shape({
    formId: PropTypes.string,
    trackingPrefix: PropTypes.string,
    chapters: PropTypes.object,
  }).isRequired,
  chapterSectionCollection: PropTypes.shape({
    showPageTitles: PropTypes.bool,
  }),
  children: PropTypes.node,
  confirmationNumber: PropTypes.string,
  devOnly: PropTypes.shape({
    showButtons: PropTypes.bool,
    mockData: PropTypes.object,
  }),
  pdfUrl: PropTypes.string,
  submitDate: PropTypes.any,
  filename: PropTypes.string,
};

ConfirmationView.SubmissionAlert = SubmissionAlertWithContext;
ConfirmationView.SavePdfDownload = SavePdfDownloadWithContext;
ConfirmationView.WhatsNextProcessList = WhatsNextProcessListWithContext;
ConfirmationView.PrintThisPage = PrintThisPage;
ConfirmationView.HowToContact = HowToContact;
ConfirmationView.NeedHelp = NeedHelp;
ConfirmationView.GoBackLink = GoBackLink;
ConfirmationView.ChapterSectionCollection = ChapterSectionCollectionWithContext;
