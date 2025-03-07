import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import PrintHeader from '../shared/PrintHeader';
import PrintDownload from '../shared/PrintDownload';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import InfoAlert from '../shared/InfoAlert';
import GenerateRadiologyPdf from './GenerateRadiologyPdf';
import {
  pageTitles,
  studyJobStatus,
  ALERT_TYPE_IMAGE_STATUS_ERROR,
} from '../../util/constants';
import {
  formatNameFirstLast,
  generateTextFile,
  getNameDateAndTime,
  formatDateAndTime,
  formatUserDob,
} from '../../util/helpers';
import DateSubheading from '../shared/DateSubheading';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import {
  fetchImageRequestStatus,
  fetchBbmiNotificationStatus,
  requestImages,
} from '../../actions/images';
import useAlerts from '../../hooks/use-alerts';
import HeaderSection from '../shared/HeaderSection';
import LabelValue from '../shared/LabelValue';

const RadiologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;

  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );

  const allowMarchUpdates = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsUpdateLandingPage
      ],
  );

  const dispatch = useDispatch();
  const elementRef = useRef(null);
  const processingAlertHeadingRef = useRef(null);
  const [
    imageProcessingAlertRendered,
    setImageProcessingAlertRendered,
  ] = useState(false);
  const [isImageRequested, setIsImageRequested] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  // State to manage the dynamic backoff polling interval
  const [pollInterval, setPollInterval] = useState(2000);

  const [processingRequest, setProcessingRequest] = useState(false);
  const radiologyDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const {
    imageStatus: studyJobs,
    notificationStatus,
    imageRequestApiFailed,
  } = useSelector(state => state.mr.images);

  const activeAlert = useAlerts(dispatch);

  const ERROR_REQUEST_AGAIN =
    'We’re sorry. There was a problem with our system. Try requesting your images again.';
  const ERROR_TRY_LATER =
    'We’re sorry. There was a problem with our system. Try again later.';

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus());
      dispatch(fetchBbmiNotificationStatus());
    },
    [dispatch],
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
    () =>
      studyJobs?.find(img => img.studyIdUrn === radiologyDetails.studyId) ||
      null,
    [studyJobs, radiologyDetails.studyId],
  );

  useEffect(
    () => {
      if (imageRequestApiFailed) {
        setProcessingRequest(false);
      }
    },
    [imageRequestApiFailed],
  );

  useEffect(
    () => {
      let timeoutId;
      if (
        studyJob?.status === studyJobStatus.NEW ||
        studyJob?.status === studyJobStatus.PROCESSING
      ) {
        setProcessingRequest(false);

        timeoutId = setTimeout(() => {
          dispatch(fetchImageRequestStatus());
          // Increase the polling interval by 5% on each iteration, capped at 30 seconds
          setPollInterval(prevInterval => Math.min(prevInterval * 1.05, 30000));
        }, pollInterval);
      }
      // Cleanup interval on component unmount or dependencies change
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
    updatePageTitle,
  );

  const downloadPdf = () => {
    setDownloadStarted(true);
    GenerateRadiologyPdf(record, user, runningUnitTest);
  };

  const generateRadioloyTxt = async () => {
    setDownloadStarted(true);
    const content = `\n
${crisisLineHeader}\n\n
${record.name}\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatUserDob(user)}\n
${reportGeneratedBy}\n
Date entered: ${record.date}\n
${txtLine}\n\n
Reason for test: ${record.reason} \n
Clinical history: ${record.clinicalHistory} \n
Ordered by: ${record.orderedBy} \n
Location: ${record.imagingLocation} \n
Imaging provider: ${record.imagingProvider} \n
${txtLine}\n\n
Results\n
${record.results}`;

    generateTextFile(
      content,
      `VA-labs-and-tests-details-${getNameDateAndTime(user)}`,
    );
  };

  const makeImageRequest = async () => {
    setProcessingRequest(true);
    dispatch(requestImages(radiologyDetails.studyId));
    setIsImageRequested(true);
  };

  const notificationContent = () => (
    <>
      {notificationStatus ? (
        <>
          {allowMarchUpdates ? (
            <p>
              <strong>Note: </strong> If you do not want us to notifiy you about
              images, change your settings in your profile.
            </p>
          ) : (
            <p>
              <strong>Note: </strong>
              If you don’t want to get email notifications for images anymore,
              you can change your notification settings on the previous version
              of My HealtheVet.
            </p>
          )}
        </>
      ) : (
        <>
          <h3>Get email notifications for images</h3>
          <p>
            If you want us to email you when your images are ready, change your
            notification settings
            {allowMarchUpdates
              ? ` in your profile.`
              : ` on the previous version of My HealtheVet.`}
          </p>
        </>
      )}
      {allowMarchUpdates ? (
        <va-link
          className="vads-u-margin-top--1"
          href="/profile/notifications"
          text="Go to notification settings"
        />
      ) : (
        <va-link
          className="vads-u-margin-top--1"
          href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'profiles')}
          text="Go back to the previous version of My HealtheVet"
        />
      )}
    </>
  );

  const requestNote = () => (
    <p>
      After you request images, it may take several hours for us to load them
      here.
      {notificationStatus &&
        ' We’ll send you an email when your images are ready.'}
    </p>
  );

  const imagesNotRequested = imageRequest => (
    <>
      {requestNote()}
      <va-button
        onClick={() => makeImageRequest()}
        disabled={imageRequest?.percentComplete < 100}
        ref={elementRef}
        text="Request Images"
        uswds
      />
    </>
  );

  const imageAlertProcessing = imageRequest => {
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

  const imageAlertComplete = () => {
    const endDateParts = formatDateAndTime(
      new Date(studyJob.endDate + 3 * 24 * 60 * 60 * 1000), // Add 3 days
    );
    return (
      <>
        <p>
          You have until {endDateParts.date} at {endDateParts.time}{' '}
          {endDateParts.timeZone} to view and download your images. After that,
          you’ll need to request them again.
        </p>
        <p>
          <Link
            to={`/labs-and-tests/${record.id}/images`}
            className="vads-c-action-link--blue"
            data-testid="radiology-view-all-images"
          >
            View all {radiologyDetails.imageCount} images
          </Link>
        </p>
      </>
    );
  };

  const imageAlert = message => (
    <va-alert
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

  const imageAlertError = imageRequest => (
    <>
      <p>To review and download your images, you’ll need to request them.</p>
      {imageAlert(ERROR_REQUEST_AGAIN)}
      <va-button
        class="vads-u-margin-top--2"
        onClick={() => makeImageRequest()}
        data-testid="radiology-request-images-button"
        disabled={imageRequest?.percentComplete < 100}
        ref={elementRef}
        text="Request Images"
        uswds
      />
    </>
  );

  const imageStatusContent = () => {
    if (radiologyDetails.studyId) {
      if (processingRequest) {
        return (
          <va-loading-indicator
            message="Loading..."
            setFocus
            data-testid="loading-indicator"
          />
        );
      }

      if (activeAlert && activeAlert.type === ALERT_TYPE_IMAGE_STATUS_ERROR) {
        return imageAlert(ERROR_TRY_LATER);
      }

      return (
        <>
          {(!studyJob || studyJob.status === studyJobStatus.NONE) &&
            imagesNotRequested(studyJob)}
          {(studyJob?.status === studyJobStatus.NEW ||
            studyJob?.status === studyJobStatus.PROCESSING) &&
            imageAlertProcessing(studyJob)}
          {studyJob?.status === studyJobStatus.COMPLETE && imageAlertComplete()}
          {(imageRequestApiFailed ||
            studyJob?.status === studyJobStatus.ERROR) &&
            imageAlertError(studyJob)}
          {notificationContent()}
        </>
      );
    }
    return <p>There are no images attached to this report.</p>;
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
            <h3 className="vads-u-font-size--lg vads-u-font-family--sans no-print">
              Images ready
            </h3>
            {imageAlertComplete()}
          </VaAlert>
        )}
        {downloadStarted && <DownloadSuccessAlert />}
        <PrintDownload
          description="L&TR Detail"
          downloadPdf={downloadPdf}
          downloadTxt={generateRadioloyTxt}
          allowTxtDownloads={allowTxtDownloads}
        />
        <DownloadingRecordsInfo
          description="L&TR Detail"
          allowTxtDownloads={allowTxtDownloads}
        />

        <div className="test-details-container max-80">
          <HeaderSection header="Details about this test">
            <LabelValue
              label="Reason for test"
              value={record.reason}
              testId="radiology-reason"
              actionName="[admission discharge summary - location]"
            />
            <LabelValue
              label="Clinical history"
              value={record.clinicalHistory}
              testId="radiology-clinical-history"
              actionName="[lab and tests - radiology clinical history]"
            />
            <LabelValue
              label="Ordered by"
              value={record.orderedBy}
              testId="radiology-ordered-by"
              actionName="[lab and tests - radiology ordered by]"
            />
            <LabelValue
              label="Location"
              value={record.imagingLocation}
              testId="radiology-imaging-location"
              actionName="[lab and tests - radiology location]"
            />
            <LabelValue
              label="Imaging provider"
              value={record.imagingProvider}
              testId="radiology-imaging-provider"
              actionName="[lab and tests - radiology provider]"
            />
          </HeaderSection>
        </div>

        <div className="test-results-container">
          <HeaderSection header="Results" className="test-results-header">
            <InfoAlert fullState={fullState} />
            <p
              data-testid="radiology-record-results"
              className="monospace"
              data-dd-privacy="mask"
              data-dd-action-name="[lab and tests - radiology results]"
            >
              {record.results}
            </p>
          </HeaderSection>
        </div>

        <div className="test-results-container">
          <HeaderSection header="Images" className="test-results-header">
            {imageStatusContent()}
          </HeaderSection>
        </div>
      </HeaderSection>
    </div>
  );
};

export default RadiologyDetails;

RadiologyDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
