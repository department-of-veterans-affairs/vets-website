import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Toggler,
  useFeatureToggle,
} from '~/platform/utilities/feature-toggles';
import { selectPdfUrlLoading } from '~/applications/personalization/dashboard/selectors';
import recordEvent from '~/platform/monitoring/record-event';
import fetchFormPdfUrl from '../../actions/form-pdf-url';
import {
  formatFormTitle,
  formatSubmissionDisplayStatus,
  recordDashboardClick,
} from '../../helpers';

/**
 * This component is a merge of the DraftCard and SubmissionCard components
 * for the upcoming dashboard redesign switch.
 * Comments are included to indicate where the differences are and can be removed
 * after the switch.
 */

// Shared content blocks (copied from SubmissionCard/DraftCard where applicable)

const QuestionsContent = () => (
  <p className="vads-u-margin-bottom--0">
    If you have questions, call us at <va-telephone contact="8008271000" /> (
    <va-telephone contact="711" tty />
    ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
  </p>
);

const ReceivedContent = () => (
  <>
    <p>
      Next step: We’ll review your form. If we need more information, we’ll
      contact you.
    </p>
    <QuestionsContent />
  </>
);

const InProgressContent = () => (
  <>
    <p>
      Next step: We’ll confirm that we’ve received your form. This can take up
      to 30 days.
    </p>
    <QuestionsContent />
  </>
);

const ActionNeededContent = () => (
  <div className="vads-u-margin-top--0p5">
    <va-alert
      slim="true"
      status="error"
      disable-analytics="false"
      visible="true"
      closeable="false"
      full-width="false"
      class="hydrated"
    >
      <p className="vads-u-margin-y--0">
        We’re sorry. There was a problem with our system. We couldn’t process
        this form. Call us at <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  </div>
);

const CHAMPVA_FORM_ID_MAP = {
  '10-10D': '10-10d',
  '10-10D-EXTENDED': '10-10d',
  '10-7959A': '10-7959a',
  '10-7959C': '10-7959c',
  '10-7959F-1': '10-7959f-1',
  '10-7959F-2': '10-7959f-2',
};

const isChampvaForm = formId =>
  Object.prototype.hasOwnProperty.call(CHAMPVA_FORM_ID_MAP, formId);

const SavePdfDownload = ({
  formId,
  getPdfDownloadUrl,
  guid,
  showLoadingIndicator,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showDownloadingButton, setShowDownloadingButton] = useState(false);

  useEffect(
    () => {
      if (!showLoadingIndicator) {
        setTimeout(() => setShowDownloadingButton(false), 3000);
      }
    },
    [showLoadingIndicator],
  );

  const handleDownloadButtonClick = async () => {
    setError(null);
    setShowDownloadingButton(true);
    const result = await getPdfDownloadUrl(formId, guid);

    if (result.error) {
      setError(result.error);
    } else {
      // Open the PDF in a new tab to allow the browser to handle the download
      window.open(result.url, '_blank');
      recordEvent({
        event: 'file_download',
        /* eslint-disable camelcase */
        click_text: 'Download your completed form (PDF)',
        click_url: undefined, // URL contains PII
        file_name: `${formId}.pdf`,
        file_extension: 'pdf',
        /* eslint-enable camelcase */
      });
      setShowSuccess(true);
    }
  };

  return (
    <div>
      <div>
        {showSuccess ? (
          <va-alert
            class="vads-u-margin-bottom--1"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            full-width="false"
            slim
            status="success"
            visible="true"
          >
            <p className="vads-u-margin-y--0">Your download has started.</p>
          </va-alert>
        ) : null}
      </div>

      {showDownloadingButton ? (
        <va-button
          className=" vads-u-padding-y--1p5 vads-u-padding-x--2p5"
          full-width
          loading
          text="Downloading..."
        />
      ) : (
        // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
        <button
          className="usa-button vads-u-margin-y--1p5 vads-u-width--full"
          type="button"
          onClick={handleDownloadButtonClick}
        >
          <va-icon
            icon="file_download"
            size={2}
            class="vads-u-margin-right--1"
            aria-hidden="true"
          />
          Download your completed form (PDF)
        </button>
      )}

      {error ? (
        <va-alert
          class="vads-u-margin-bottom--1"
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          slim
          status="error"
          visible="true"
        >
          <p className="vads-u-margin-y--0">{error}</p>
        </va-alert>
      ) : null}
    </div>
  );
};

SavePdfDownload.propTypes = {
  formId: PropTypes.string.isRequired,
  getPdfDownloadUrl: PropTypes.func.isRequired,
  guid: PropTypes.string.isRequired,
  showLoadingIndicator: PropTypes.bool,
};

export const ApplicationCard = ({
  // Common
  formId,
  formTitle,
  lastSavedDate,
  presentableFormId,

  // Draft-only
  continueUrl,
  expirationDate,
  isForm,

  // Submission-only
  status,
  submittedDate,
  guid,
  pdfSupport,
  getPdfDownloadUrl,
  showLoadingIndicator,
}) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const champvaProviderEnabled = useToggleValue(
    TOGGLE_NAMES.benefitsClaimsIvcChampvaProvider,
  );
  const isDraft = !!continueUrl;
  const champvaForm = champvaProviderEnabled && isChampvaForm(formId);

  const headerLabel = isDraft ? 'Draft' : formatSubmissionDisplayStatus(status);
  let mainTitle = formTitle;
  if (!isDraft) {
    mainTitle = champvaForm
      ? 'Application for CHAMPVA benefits'
      : formatFormTitle(formTitle);
  }

  let formLine = null;
  if (champvaForm) {
    formLine = `VA Form ${CHAMPVA_FORM_ID_MAP[formId]}`;
  } else if (presentableFormId) {
    formLine = `VA ${presentableFormId.replace(/\bFORM\b/, 'Form')}`;
  }

  const testId = isDraft ? 'application-in-progress' : 'submitted-application';

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid={testId}
    >
      <va-card>
        <div>
          <div className="vads-u-width--full">
            <span className="usa-label">{headerLabel}</span>
            <h4 className="vads-u-margin-top--1p5 vads-u-margin-bottom--0">
              {mainTitle}
            </h4>

            {formLine && (
              <p
                id={formId}
                className="vads-u-margin-top--0p5 vads-u-margin-bottom--0"
              >
                {formLine}
              </p>
            )}

            {isDraft ? (
              <>
                <div className="vads-u-display--flex vads-u-margin-top--0p5">
                  <span className="vads-u-margin-right--0p5">
                    <va-icon icon="error" size={3} aria-hidden="true" />
                    <span className="sr-only">Alert: </span>
                  </span>
                  <div>
                    <p className="vads-u-margin-y--0">
                      {isForm ? 'Form' : 'Application'} expires on:{' '}
                      {expirationDate}
                    </p>
                  </div>
                </div>
                <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                  Last saved on: {lastSavedDate}
                </p>
                <div className="vads-u-margin-top--0p5 vads-u-padding-y--1">
                  <va-link
                    active
                    text={isForm ? 'Continue form' : 'Continue application'}
                    href={continueUrl}
                    onClick={recordDashboardClick(formId, 'continue-button')}
                  />
                </div>
              </>
            ) : (
              <>
                <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaFormPdfLink}>
                  <Toggler.Enabled>
                    {pdfSupport && (
                      <SavePdfDownload
                        formId={formId}
                        getPdfDownloadUrl={getPdfDownloadUrl}
                        guid={guid}
                        showLoadingIndicator={showLoadingIndicator}
                      />
                    )}
                  </Toggler.Enabled>
                </Toggler>

                <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                  Submitted on: {submittedDate}
                  {status === 'received' && (
                    <>
                      <br />
                      Received on: {lastSavedDate}
                    </>
                  )}
                  {status === 'actionNeeded' && (
                    <>
                      <br />
                      Submission failed on: {lastSavedDate}
                    </>
                  )}
                </p>

                {status === 'inProgress' && <InProgressContent />}
                {status === 'received' && <ReceivedContent />}
                {status === 'actionNeeded' && <ActionNeededContent />}
              </>
            )}
          </div>
        </div>
      </va-card>
    </div>
  );
};

ApplicationCard.propTypes = {
  formId: PropTypes.string.isRequired,
  formTitle: PropTypes.string.isRequired,
  lastSavedDate: PropTypes.string.isRequired,
  continueUrl: PropTypes.string,
  expirationDate: PropTypes.string,
  getPdfDownloadUrl: PropTypes.func,
  guid: PropTypes.string,
  isForm: PropTypes.bool,
  pdfSupport: PropTypes.bool,
  presentableFormId: PropTypes.string,
  showLoadingIndicator: PropTypes.bool,
  status: PropTypes.oneOf(['inProgress', 'actionNeeded', 'received']),
  submittedDate: PropTypes.string,
};

const mapStateToProps = state => {
  const isLoadingPdfDownloads = selectPdfUrlLoading(state);
  return {
    showLoadingIndicator: isLoadingPdfDownloads,
  };
};

const mapDispatchToProps = {
  getPdfDownloadUrl: fetchFormPdfUrl,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationCard);
