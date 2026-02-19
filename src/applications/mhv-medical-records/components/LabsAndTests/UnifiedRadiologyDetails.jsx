import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  usePrintTitle,
  makePdf,
  generatePdfScaffold,
  getNameDateAndTime,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import DateSubheading from '../shared/DateSubheading';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';
import TrackedSpinner from '../shared/TrackedSpinner';
import JobCompleteAlert from '../shared/JobsCompleteAlert';
import {
  pageTitles,
  studyJobStatus,
  ALERT_TYPE_IMAGE_STATUS_ERROR,
  radiologyErrors,
  uhdRecordSource,
  loincCodes,
} from '../../util/constants';
import { generateTextFile, sendDataDogAction } from '../../util/helpers';
import {
  generateLabsIntro,
  generateRadiologyContent,
} from '../../util/pdfHelpers/labsAndTests';
import {
  fetchImageRequestStatus,
  fetchBbmiNotificationStatus,
  requestImages,
  setStudyRequestLimitReached,
} from '../../actions/images';
import useAlerts from '../../hooks/use-alerts';
import { RADIOLOGY_DETAILS_MY_VA_HEALTH_LINK } from '../../util/rumConstants';
import { pdfPrinter, txtPrinter } from '../../util/printHelper';

const UnifiedRadiologyDetails = props => {
  const {
    record,
    user,
    runningUnitTest = false,
    basePath = '/labs-and-tests',
  } = props;
  const dispatch = useDispatch();
  const elementRef = useRef(null);
  const processingAlertHeadingRef = useRef(null);

  const emptyField = 'None noted';

  const isOracleHealth = record.source === uhdRecordSource.ORACLE_HEALTH;
  const isRadiology = record.testCode === loincCodes.UHD_RADIOLOGY;

  // The unified record may carry an imagingStudyId merged from SCDF imaging
  // studies, or a studyId from the base record.
  const studyId = record.imagingStudyId || record.studyId || null;

  const {
    imageStatus: studyJobs,
    notificationStatus,
    studyRequestLimitReached,
    imageRequestApiFailed,
  } = useSelector(state => state.mr.images);

  const [
    imageProcessingAlertRendered,
    setImageProcessingAlertRendered,
  ] = useState(false);
  const [isImageRequested, setIsImageRequested] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [pollInterval, setPollInterval] = useState(2000);
  const [processingRequest, setProcessingRequest] = useState(false);

  const activeAlert = useAlerts(dispatch);

  // Fetch image request status on mount (only for non-OH radiology)
  useEffect(
    () => {
      if (!isOracleHealth && studyId) {
        dispatch(fetchImageRequestStatus());
        dispatch(fetchBbmiNotificationStatus());
      }
    },
    [dispatch, isOracleHealth, studyId],
  );

  useEffect(
    () => {
      if (studyJobs?.length) {
        const jobsInProcess = studyJobs.filter(
          job =>
            job.status === studyJobStatus.NEW ||
            job.status === studyJobStatus.QUEUED ||
            job.status === studyJobStatus.PROCESSING,
        );
        if (jobsInProcess.length >= 3) {
          dispatch(setStudyRequestLimitReached(true));
        } else if (studyRequestLimitReached) {
          dispatch(setStudyRequestLimitReached(false));
        }
      }
    },
    [dispatch, studyJobs, studyRequestLimitReached],
  );

  useEffect(
    () => {
      if (processingAlertHeadingRef.current) {
        setImageProcessingAlertRendered(true);
      }
    },
    [processingAlertHeadingRef.current],
  );

  useEffect(
    () => {
      if (imageProcessingAlertRendered && isImageRequested) {
        focusElement(processingAlertHeadingRef.current);
      }
    },
    [imageProcessingAlertRendered, isImageRequested],
  );

  const studyJob = useMemo(
    () => studyJobs?.find(img => img.studyIdUrn === studyId) || null,
    [studyJobs, studyId],
  );

  useEffect(
    () => {
      if (
        imageRequestApiFailed ||
        studyRequestLimitReached ||
        studyJob?.status
      ) {
        setProcessingRequest(false);
      }
    },
    [imageRequestApiFailed, studyJob, studyRequestLimitReached],
  );

  // Backoff polling for image request status
  useEffect(
    () => {
      let timeoutId;
      if (
        studyJob?.status === studyJobStatus.NEW ||
        studyJob?.status === studyJobStatus.QUEUED ||
        studyJob?.status === studyJobStatus.PROCESSING
      ) {
        setProcessingRequest(false);
        timeoutId = setTimeout(() => {
          dispatch(fetchImageRequestStatus());
          setPollInterval(prevInterval => Math.min(prevInterval * 1.05, 30000));
        }, pollInterval);
      }
      return () => clearTimeout(timeoutId);
    },
    [studyJob?.status, pollInterval, dispatch],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
    },
    [record],
  );

  usePrintTitle(
    pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE,
    user.userFullName,
    user.dob,
  );

  // --- Download helpers ---

  const generatePdf = async () => {
    setDownloadStarted(true);
    if (record.result) {
      // Radiology record with a full report — use radiology-specific PDF
      const { title, subject, subtitles } = generateLabsIntro(record);
      const scaffold = generatePdfScaffold(user, title, subject);
      const pdfData = {
        ...scaffold,
        subtitles,
        ...generateRadiologyContent(record),
      };
      const pdfName = `VA-labs-and-tests-details-${getNameDateAndTime(user)}`;
      try {
        await makePdf(
          pdfName,
          pdfData,
          'medicalRecords',
          'Medical Records - Unified Radiology details - PDF generation error',
          runningUnitTest,
        );
      } catch {
        // makePdf handles error logging
      }
    } else {
      // Fallback: use generic unified lab/test PDF printer
      const data = pdfPrinter({ record, user });
      try {
        await makePdf(
          data.title,
          data.body,
          'medicalRecords',
          'Medical Records - Unified Radiology details - PDF generation error',
          runningUnitTest,
        );
      } catch {
        // makePdf handles error logging
      }
    }
  };

  const generateTxt = async () => {
    setDownloadStarted(true);
    const data = txtPrinter({ record, user });
    generateTextFile(data.body, data.title);
  };

  // --- Image request helpers ---

  const makeImageRequest = async () => {
    setProcessingRequest(true);
    dispatch(requestImages(studyId));
    setIsImageRequested(true);
  };

  const notificationContent = () => (
    <>
      {notificationStatus ? (
        <p>
          <strong>Note: </strong> If you do not want us to notify you about
          images, change your settings in your profile.
        </p>
      ) : (
        <>
          <h3>Get email notifications for images</h3>
          <p>
            If you want us to email you when your images are ready, change your
            notification settings in your profile.
          </p>
        </>
      )}
      <va-link
        className="vads-u-margin-top--1"
        href="/profile/notifications"
        text="Go to notification settings"
      />
    </>
  );

  const requestNote = () => (
    <p>
      After you request images, it may take several hours for us to load them
      here.
      {notificationStatus &&
        ' We will send you an email when your images are ready.'}
    </p>
  );

  const jobProcessingAlert = imageRequest => {
    const percent =
      imageRequest.status === studyJobStatus.NEW
        ? 0
        : imageRequest.percentComplete;
    return (
      <>
        {requestNote()}
        <va-alert
          status="info"
          visible
          aria-live="polite"
          data-testid="image-request-progress-alert"
        >
          <h3
            aria-describedby="in-progress-description"
            ref={processingAlertHeadingRef}
            slot="headline"
          >
            Image request
          </h3>
          <p id="in-progress-description" className="sr-only">
            in progress{' '}
          </p>
          <p>{percent}% complete</p>
          <va-progress-bar percent={percent} />
        </va-alert>
      </>
    );
  };

  const imageAlert = message => (
    <va-alert
      class="vads-u-margin-bottom--2"
      status="error"
      visible
      aria-live="polite"
      data-testid="image-request-error-alert"
    >
      <h3 id="track-your-status-on-mobile" slot="headline">
        We couldn’t access your images
      </h3>
      <p>{message}</p>
      <p>
        If it still doesn’t work, call us at{' '}
        <va-telephone contact="8773270022" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  );

  const isLimitReachedPertinent =
    studyRequestLimitReached &&
    studyJob?.status !== studyJobStatus.NEW &&
    studyJob?.status !== studyJobStatus.QUEUED &&
    studyJob?.status !== studyJobStatus.PROCESSING &&
    studyJob?.status !== studyJobStatus.COMPLETE;

  const disableRequestImages = imageStudyJob => {
    return (
      imageStudyJob &&
      (imageStudyJob.status === studyJobStatus.NEW ||
        imageStudyJob.status === studyJobStatus.QUEUED ||
        imageStudyJob.status === studyJobStatus.PROCESSING) &&
      imageStudyJob.percentComplete < 100
    );
  };

  const renderRequestImagesControl = imageRequest => {
    if (isLimitReachedPertinent) {
      return (
        <p>
          You can’t request images for this report right now. You can only have
          3 image requests at a time. Once a report is done processing you can
          request images for this report here.
        </p>
      );
    }

    return (
      <va-button
        onClick={makeImageRequest}
        disabled={disableRequestImages(imageRequest)}
        ref={elementRef}
        text="Request Images"
        data-testid="radiology-request-images-button"
        uswds
      />
    );
  };

  const imagesNotRequested = imageRequest => (
    <>
      {!isLimitReachedPertinent && requestNote()}
      {renderRequestImagesControl(imageRequest)}
    </>
  );

  const imageAlertError = imageRequest => (
    <>
      <p>To review and download your images, you’ll need to request them.</p>
      {imageAlert(radiologyErrors.ERROR_REQUEST_AGAIN)}
      {renderRequestImagesControl(imageRequest)}
    </>
  );

  const renderJobCompleteAlert = () => {
    return (
      <JobCompleteAlert
        records={[record]}
        studyJobs={[studyJob]}
        basePath={basePath}
      />
    );
  };

  /**
   * Oracle Health radiology records show a link to My VA Health portal
   * instead of CVIX image request controls.
   */
  const oracleHealthImagesContent = () => (
    <>
      <p className="vads-u-margin-bottom--2">
        We’re working to give you access to your images here. For now, go to
        your My VA Health portal to review and download any images that are
        available.
      </p>
      <va-link-action
        class="no-print"
        type="secondary"
        href="https://patientportal.myhealth.va.gov/pages/health_record/imaging?authenticated=true"
        data-testid="radiology-oracle-health-link"
        text="Go to My VA Health"
        data-dd-action-name={RADIOLOGY_DETAILS_MY_VA_HEALTH_LINK}
        onClick={() => {
          sendDataDogAction(RADIOLOGY_DETAILS_MY_VA_HEALTH_LINK);
        }}
      />
    </>
  );

  /**
   * VistA radiology: CVIX image request workflow.
   */
  const vistaImagesContent = () => {
    if (!studyId) {
      return <p>There are no images attached to this report.</p>;
    }

    if (processingRequest) {
      return (
        <TrackedSpinner
          id="radiology-images-requested-spinner"
          message="Loading..."
          set-focus
          data-testid="loading-indicator"
        />
      );
    }

    if (activeAlert && activeAlert.type === ALERT_TYPE_IMAGE_STATUS_ERROR) {
      return imageAlert(radiologyErrors.ERROR_TRY_LATER);
    }

    const newOrProcessing =
      studyJob?.status === studyJobStatus.NEW ||
      studyJob?.status === studyJobStatus.QUEUED ||
      studyJob?.status === studyJobStatus.PROCESSING;
    const jobComplete = studyJob?.status === studyJobStatus.COMPLETE;
    const requestFailedOrError =
      imageRequestApiFailed || studyJob?.status === studyJobStatus.ERROR;
    const nillOrLimitReached =
      (!studyJob || studyRequestLimitReached) && !requestFailedOrError;

    return (
      <>
        {nillOrLimitReached && imagesNotRequested(studyJob)}
        {newOrProcessing && jobProcessingAlert(studyJob)}
        {jobComplete && renderJobCompleteAlert()}
        {requestFailedOrError && imageAlertError(studyJob)}
        {notificationContent()}
      </>
    );
  };

  const imageStatusContent = () => {
    if (isOracleHealth && isRadiology) {
      return oracleHealthImagesContent();
    }
    return vistaImagesContent();
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <PrintHeader />
      <HeaderSection
        header={record.name}
        className="vads-u-margin-bottom--0"
        aria-describedby="radiology-date"
        data-testid="radiology-record-name"
        data-dd-privacy="mask"
        data-dd-action-name="[lab and tests - radiology name]"
      >
        <DateSubheading
          date={record.date}
          id="radiology-date"
          label="Date and time performed"
          labelClass="vads-font-weight-regular"
        />
        {studyJob?.status === studyJobStatus.COMPLETE && (
          <VaAlert
            status="success"
            visible
            class="vads-u-margin-top--4 no-print"
            role="alert"
            data-testid="alert-download-started"
          >
            <h3 className="vads-u-font-size--lg no-print" slot="headline">
              Images ready
            </h3>
            {renderJobCompleteAlert()}
          </VaAlert>
        )}
        {downloadStarted && <DownloadSuccessAlert />}

        {/*                   TEST DETAILS                          */}
        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            <LabelValue
              ifEmpty={emptyField}
              label="Reason for test"
              value={record.reason}
              testId="radiology-reason"
              actionName="[lab and tests - radiology reason]"
            />
            <LabelValue
              ifEmpty={emptyField}
              label="Clinical history"
              value={record.clinicalHistory}
              testId="radiology-clinical-history"
              actionName="[lab and tests - radiology clinical history]"
            />
            <LabelValue
              ifEmpty={emptyField}
              label="Ordered by"
              value={record.orderedBy}
              testId="radiology-ordered-by"
              actionName="[lab and tests - radiology ordered by]"
            />
            <LabelValue
              ifEmpty={emptyField}
              label="Location"
              value={record.location || record.imagingLocation}
              testId="radiology-imaging-location"
              actionName="[lab and tests - radiology location]"
            />
            <LabelValue
              ifEmpty={emptyField}
              label="Imaging provider"
              value={record.imagingProvider}
              testId="radiology-imaging-provider"
              actionName="[lab and tests - radiology provider]"
            />
          </HeaderSection>
        </div>

        {/*                   RESULTS                               */}
        <div className="test-results-container">
          <HeaderSection header="Results" className="test-results-header">
            <InfoAlert fullState />
            <p
              data-testid="radiology-record-results"
              className="monospace"
              data-dd-privacy="mask"
              data-dd-action-name="[lab and tests - radiology results]"
            >
              {record.result || record.results}
            </p>
          </HeaderSection>
        </div>

        {/*                   IMAGES                                */}
        <div className="test-results-container">
          <HeaderSection header="Images" className="test-results-header">
            {imageStatusContent()}
          </HeaderSection>
        </div>

        <div className="vads-u-margin-y--4 vads-u-border-top--1px vads-u-border-color--gray-light" />
      </HeaderSection>
      <div className="vads-u-margin-top--3">
        <DownloadingRecordsInfo description="L&TR Detail" />
      </div>
      <PrintDownload
        description="L&TR Detail"
        downloadPdf={generatePdf}
        downloadTxt={generateTxt}
      />
      <div className="vads-u-margin-y--5 vads-u-border-top--1px vads-u-border-color--white" />
    </div>
  );
};

export default UnifiedRadiologyDetails;

UnifiedRadiologyDetails.propTypes = {
  record: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    reason: PropTypes.string,
    clinicalHistory: PropTypes.string,
    orderedBy: PropTypes.string,
    location: PropTypes.string,
    imagingLocation: PropTypes.string,
    imagingProvider: PropTypes.string,
    result: PropTypes.string,
    results: PropTypes.string,
    source: PropTypes.string,
    testCode: PropTypes.string,
    studyId: PropTypes.string,
    imagingStudyId: PropTypes.string,
  }).isRequired,
  basePath: PropTypes.string,
  runningUnitTest: PropTypes.bool,
  user: PropTypes.object,
};
