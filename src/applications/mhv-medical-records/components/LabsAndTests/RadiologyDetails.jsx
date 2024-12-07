import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { pageTitles } from '../../util/constants';
import {
  formatNameFirstLast,
  generateTextFile,
  getNameDateAndTime,
  createImagingRequest,
} from '../../util/helpers';
import DateSubheading from '../shared/DateSubheading';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import { setImageRequestStatus } from '../../actions/images';

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
  const [isRunning, setIsRunning] = useState(false);
  const [imageReqData, setImageReqData] = useState({});
  const radiologyDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const imageRequests = useSelector(state => state.mr.images.imageStatus);

  useEffect(
    () => {
      dispatch(setImageRequestStatus());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (imageRequests) {
        setImageReqData(
          imageRequests.find(
            img => img.studyIdUrn === radiologyDetails.studyId,
          ),
        );
      }
    },
    [imageRequests],
  );

  useEffect(
    () => {
      if (elementRef.current) {
        if (isRunning) return;
        setIsRunning(true);
        const processingInterval = setInterval(prevState => {
          dispatch(setImageRequestStatus());
          if (imageReqData.percentComplete >= 100) {
            clearInterval(processingInterval);
            setIsRunning(false);
            return 100;
          }
          return prevState;
        }, 2000);
      }
    },
    [elementRef.current, imageRequests],
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
    createImagingRequest(radiologyDetails.studyId);
  };

  const content = () => {
    if (imageRequests) {
      const imageRequest = imageRequests.find(
        img => img.studyIdUrn === radiologyDetails.studyId,
      );
      return (
        <>
          {/* Debug Only: {imageRequest.status} - {imageRequest.percentComplete} */}
          {imageRequest.status === 'ERROR' && (
            <>
              <p>
                To review and download your images, you’ll need to request them.
              </p>
              <va-alert
                class="vads-u-margin-bottom--1"
                closeable="false"
                disable-analytics="false"
                full-width="false"
                role="alert"
                status="error"
                visible="true"
              >
                <h2 id="track-your-status-on-mobile" slot="headline">
                  We couldn’t access your images
                </h2>
                <p className="vads-u-margin-y--0">
                  We’re sorry. There was a problem with our system. Try
                  requesting your images again.
                </p>
                <br />
                <p className="vads-u-margin-y--0">
                  If it still doesn’t work, call us at{' '}
                  <va-telephone contact="8773270022" /> (
                  <va-telephone tty contact="711" />
                  ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.
                  ET.
                </p>
              </va-alert>
              {/* Request Images button will go here */}
              <button
                className="vads-u-margin-y--0p5"
                onClick={() => makeImageRequest()}
                style={{ width: '100%' }}
                disabled={imageRequest.percentComplete < 100}
                ref={elementRef}
              >
                <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center">
                  <span className="vads-u-margin-left--0p5">
                    Request Images
                  </span>
                </div>
              </button>
              <h2>Get email notifications for images</h2>
              <p>
                If you want us to email you when your images are ready, change
                your notification settings on the previous version of My
                HealtheVet.
              </p>
              {/* "Go back to previous version of My HealtheVet" */}
              <va-link
                className="vads-u-margin-top--1"
                href="#"
                text="Go back to the previous version of My HealtheVet"
              />
            </>
          )}
          {imageRequest.status === 'NONE' && (
            <>
              <p>
                To review and download your images, you’ll need to request them.
              </p>
              {/* Request Images button will go here */}
              <button
                className="vads-u-margin-y--0p5"
                onClick={() => makeImageRequest()}
                style={{ width: '100%' }}
                disabled={imageRequest.percentComplete < 100}
                ref={elementRef}
              >
                <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center">
                  <span className="vads-u-margin-left--0p5">
                    Request Images
                  </span>
                </div>
              </button>
              <p>
                <strong>Note: </strong> You havbe the option to receive an email
                when the images are ready to review. To change this
                notification, change your notification settings on the previous
                version of My HealtheVet.
              </p>
              {/* "Go back to previous version of My HealtheVet" */}
              <va-link
                className="vads-u-margin-top--1"
                href="#"
                text="Go back to the previous version of myHealtheVet"
              />
            </>
          )}
          {imageRequest.status === 'PROCESSING' && (
            <>
              <va-banner
                close-btn-aria-label="Close notification"
                status="info"
                visible
                iconless="true"
                ref={elementRef}
              >
                <h2 className="vads-u-margin-y--0">Image request</h2>
                <p>{imageRequest.percentComplete}% complete</p>
                <va-progress-bar percent={imageRequest.percentComplete} />
              </va-banner>
            </>
          )}
          {imageRequest.status === 'COMPLETE' && (
            <>
              <va-alert
                close-btn-aria-label="Close notification"
                status="success"
                visible
              >
                <h2 slot="headline">Images ready</h2>
                <p className="vads-u-margin-y--0">
                  You have until 12/31/2023 at 4:30 p.m. [timezone] to view and
                  download your images. After that, you’ll need to request them
                  again.
                </p>
                <va-link
                  className="vads-u-margin-top--1"
                  href={`/my-health/medical-records/labs-and-tests/${
                    record.id
                  }/images`}
                  text="View images"
                />
              </va-alert>
            </>
          )}
        </>
      );
    }
    return <p>There ar no images attached to this report.</p>;
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
        <h3 className="vads-u-font-size--md vads-u-font-family--sans no-print">
          Images
        </h3>
        <p data-testid="radiology-image" className="no-print">
          Images are not yet available in this new medical records tool. To get
          images, you’ll need to request them in the previous version of medical
          records on the My HealtheVet website.
        </p>
        <va-link
          href={mhvUrl(
            isAuthenticatedWithSSOe(fullState),
            'va-medical-images-and-reports',
          )}
          text="Request images on the My HealtheVet website"
          data-testid="radiology-images-link"
        />
      </div>

      <div className="test-results-container">
        <h2>Results</h2>
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
        <h2>Images</h2>
        {content()}
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
