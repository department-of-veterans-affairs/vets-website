import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Toggler } from '~/platform/utilities/feature-toggles';
import { selectPdfUrlLoading } from '~/applications/personalization/dashboard/selectors';
import recordEvent from '~/platform/monitoring/record-event';
import fetchFormPdfUrl from '../../actions/form-pdf-url';
import { formatFormTitle, formatSubmissionDisplayStatus } from '../../helpers';

const QuestionsContent = () => (
  <p className="vads-u-margin-bottom--0">
    If you have questions, call us at <va-telephone contact="8008271000" /> (
    <va-telephone contact="711" tty />
    ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
  </p>
);

const ReceivedContent = ({ lastSavedDate }) => (
  <>
    <p className="vads-u-margin-y--0">Received on: {lastSavedDate}</p>
    <p>
      Next step: We’ll review your form. If we need more information, we’ll
      contact you.
    </p>
    <QuestionsContent />
  </>
);
ReceivedContent.propTypes = {
  lastSavedDate: PropTypes.string.isRequired,
};

/**
 * todo:
 *
 * Date calculation
 * - pass in received date
 * - add logic for expiration (60 days)
 */
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
        clickText: 'Download your completed form (PDF)',
        clickUrl: undefined, // URL contains PII
        fileName: `${formId}.pdf`,
        fileExtension: 'pdf',
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
          className="usa-button vads-u-padding-y--1p5 vads-u-padding-x--2p5 vads-u-width--full"
          type="button"
          onClick={handleDownloadButtonClick}
        >
          <va-icon
            icon="file_download"
            size={2}
            class="vads-u-margin-right--1"
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

const InProgressContent = () => (
  <>
    <p>
      Next step: We’ll confirm that we’ve received your form. This can take up
      to 30 days.
    </p>
    <QuestionsContent />
  </>
);

const ActionNeededContent = ({ lastSavedDate }) => (
  <>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--0p5">
      Submission failed on: {lastSavedDate}
    </p>
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
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
    </va-alert>
  </>
);
ActionNeededContent.propTypes = {
  lastSavedDate: PropTypes.string.isRequired,
};

const SubmissionCard = ({
  formId,
  formTitle,
  getPdfDownloadUrl,
  guid,
  showLoadingIndicator,
  lastSavedDate,
  submittedDate,
  pdfSupport,
  presentableFormId,
  status,
}) => {
  const content = (
    <>
      <div className="vads-u-width--full">
        <h3 className="vads-u-margin-y--0">
          <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
            {formatSubmissionDisplayStatus(status)}
          </span>
          <span className="vads-u-display--block vads-u-font-size--h3 vads-u-margin-top--1p5">
            {formatFormTitle(formTitle)}
          </span>
        </h3>
        {presentableFormId && (
          <p
            id={formId}
            className="vads-u-text-transform--uppercase vads-u-margin-top--0p5 vads-u-margin-bottom--2"
          >
            {/* TODO: rethink our helpers for presentable form ID */}
            VA {presentableFormId.replace(/\bFORM\b/, 'Form')}
          </p>
        )}

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
        <p className="vads-u-margin-bottom--0">Submitted on: {submittedDate}</p>
        {status === 'inProgress' && <InProgressContent />}
        {status === 'received' && (
          <ReceivedContent lastSavedDate={lastSavedDate} />
        )}
        {status === 'actionNeeded' && (
          <ActionNeededContent lastSavedDate={lastSavedDate} />
        )}
      </div>
    </>
  );

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid="submitted-application"
    >
      <va-card>
        <div>{content}</div>
      </va-card>
    </div>
  );
};

SubmissionCard.propTypes = {
  // The Form ID for Google Analytics tracking purposes
  formId: PropTypes.string.isRequired,
  // String to use as the main "headline" of the component
  formTitle: PropTypes.string.isRequired,
  guid: PropTypes.string.isRequired,
  // The display-ready date when the application was last updated by the user
  lastSavedDate: PropTypes.string.isRequired,
  pdfSupport: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(['inProgress', 'actionNeeded', 'received'])
    .isRequired,
  submittedDate: PropTypes.string.isRequired,
  getPdfDownloadUrl: PropTypes.func,
  presentableFormId: PropTypes.string,
  showLoadingIndicator: PropTypes.bool,
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
)(SubmissionCard);
