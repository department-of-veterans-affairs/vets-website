import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import {
  updatePageTitle,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
  usePrintTitle,
} from '@department-of-veterans-affairs/mhv/exports';
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
  accessAlertTypes,
  ALERT_TYPE_IMAGE_STATUS_ERROR,
} from '../../util/constants';
import {
  formatNameFirstLast,
  generateTextFile,
  getNameDateAndTime,
  formatDateAndTime,
} from '../../util/helpers';
import DateSubheading from '../shared/DateSubheading';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import {
  fetchImageRequestStatus,
  fetchBbmiNotificationStatus,
} from '../../actions/images';
import { requestImagingStudy } from '../../api/MrApi';
import useAlerts from '../../hooks/use-alerts';
import AccessTroubleAlertBox from '../shared/AccessTroubleAlertBox';

const RadiologyDetails = props => {
  const { record, fullState, runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );

  const dispatch = useDispatch();
  const elementRef = useRef(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  // State to manage the dynamic backoff polling interval
  const [pollInterval, setPollInterval] = useState(2000);

  const radiologyDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const studyJobs = useSelector(state => state.mr.images.imageStatus);
  const notificationStatus = useSelector(
    state => state.mr.images.notificationStatus,
  );

  const activeAlert = useAlerts(dispatch);

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus());
      dispatch(fetchBbmiNotificationStatus());
    },
    [dispatch],
  );

  const studyJob = useMemo(
    () =>
      studyJobs?.find(img => img.studyIdUrn === radiologyDetails.studyId) ||
      null,
    [studyJobs, radiologyDetails.studyId],
  );

  useEffect(
    () => {
      let timeoutId;
      if (
        studyJob?.status === studyJobStatus.NEW ||
        studyJob?.status === studyJobStatus.PROCESSING
      ) {
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
      updatePageTitle(
        `${record.name} - ${pageTitles.LAB_AND_TEST_RESULTS_PAGE_TITLE}`,
      );
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
Date of birth: ${formatDateLong(user.dob)}\n
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
    await requestImagingStudy(radiologyDetails.studyId);
    // After requesting the study, update the status.
    dispatch(fetchImageRequestStatus());
  };

  const notificationContent = () => (
    <>
      {notificationStatus ? (
        <p>
          <strong>Note: </strong> If you don’t want to get email notifications
          for images anymore, you can change your notification settings on the
          previous version of My HealtheVet.
        </p>
      ) : (
        <>
          <h3>Get email notifications for images</h3>
          <p>
            If you want us to email you when your images are ready, change your
            notification settings on the previous version of My HealtheVet.
          </p>
        </>
      )}
      <va-link
        className="vads-u-margin-top--1"
        href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'profiles')}
        text="Go back to the previous version of My HealtheVet"
      />
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

  const imageAlertProcessing = imageRequest => (
    <>
      {requestNote()}
      <va-alert
        status="info"
        visible
        aria-live="polite"
        data-testid="image-request-progress-alert"
      >
        <h3>Image request</h3>
        <p>{imageRequest.percentComplete}% complete</p>
        <va-progress-bar
          percent={
            imageRequest.status === studyJobStatus.NEW
              ? 0
              : imageRequest.percentComplete
          }
        />
      </va-alert>
    </>
  );

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
            data-testid="radiology-request-images"
          >
            View all {radiologyDetails.imageCount} images
          </Link>
        </p>
      </>
    );
  };

  const imageAlertError = imageRequest => (
    <>
      <p>To review and download your images, you’ll need to request them.</p>
      <va-alert
        status="error"
        visible
        aria-live="polite"
        data-testid="image-request-error-alert"
      >
        <h3 id="track-your-status-on-mobile" slot="headline">
          We couldn’t access your images
        </h3>
        <p className="vads-u-margin-y--0">
          We’re sorry. There was a problem with our system. Try requesting your
          images again.
        </p>
        <br />
        <p className="vads-u-margin-y--0">
          If it still doesn’t work, call us at{' '}
          <va-telephone contact="8773270022" /> (
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </va-alert>
      <va-button
        class="vads-u-margin-top--2"
        onClick={() => makeImageRequest()}
        disabled={imageRequest?.percentComplete < 100}
        ref={elementRef}
        text="Request Images"
        uswds
      />
    </>
  );

  const imageStatusContent = () => {
    if (radiologyDetails.studyId) {
      if (activeAlert && activeAlert.type === ALERT_TYPE_IMAGE_STATUS_ERROR) {
        return (
          <AccessTroubleAlertBox
            alertType={accessAlertTypes.IMAGE_STATUS}
            className="vads-u-margin-bottom--9"
          />
        );
      }

      return (
        <>
          {(!studyJob || studyJob.status === studyJobStatus.NONE) &&
            imagesNotRequested(studyJob)}
          {(studyJob?.status === studyJobStatus.NEW ||
            studyJob?.status === studyJobStatus.PROCESSING) &&
            imageAlertProcessing(studyJob)}
          {studyJob?.status === studyJobStatus.COMPLETE && imageAlertComplete()}
          {studyJob?.status === studyJobStatus.ERROR &&
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
      <h1
        className="vads-u-margin-bottom--0"
        aria-describedby="radiology-date"
        data-testid="radiology-record-name"
        data-dd-privacy="mask"
      >
        {record.name}
      </h1>
      <DateSubheading
        date={record.date}
        id="radiology-date"
        label="Date and time performed"
        labelClass="vads-font-weight-regular"
      />
      {downloadStarted && <DownloadSuccessAlert />}
      <PrintDownload
        downloadPdf={downloadPdf}
        downloadTxt={generateRadioloyTxt}
        allowTxtDownloads={allowTxtDownloads}
      />
      <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />

      <div className="test-details-container max-80">
        <h2>Details about this test</h2>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Reason for test
        </h3>
        <p data-testid="radiology-reason" data-dd-privacy="mask">
          {record.reason}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Clinical history
        </h3>
        <p data-testid="radiology-clinical-history" data-dd-privacy="mask">
          {record.clinicalHistory}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Ordered by
        </h3>
        <p data-testid="radiology-ordered-by" data-dd-privacy="mask">
          {record.orderedBy}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Location
        </h3>
        <p data-testid="radiology-imaging-location" data-dd-privacy="mask">
          {record.imagingLocation}
        </p>
        <h3 className="vads-u-font-size--md vads-u-font-family--sans">
          Imaging provider
        </h3>
        <p data-testid="radiology-imaging-provider" data-dd-privacy="mask">
          {record.imagingProvider}
        </p>
      </div>

      <div className="test-results-container">
        <h2 className="test-results-header">Results</h2>
        <InfoAlert fullState={fullState} />
        <p
          data-testid="radiology-record-results"
          className="monospace"
          data-dd-privacy="mask"
        >
          {record.results}
        </p>
      </div>

      <div className="test-results-container">
        <h2 className="test-results-header">Images</h2>
        {imageStatusContent()}
      </div>
    </div>
  );
};

export default RadiologyDetails;

RadiologyDetails.propTypes = {
  fullState: PropTypes.object,
  record: PropTypes.object,
  runningUnitTest: PropTypes.bool,
};
