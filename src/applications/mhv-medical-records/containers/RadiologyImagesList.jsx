import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getLabsAndTestsDetails } from '../actions/labsAndTests';
import { getRadiologyDetails } from '../actions/radiology';
import PrintHeader from '../components/shared/PrintHeader';
import ImageGallery from '../components/shared/ImageGallery';
import DateSubheading from '../components/shared/DateSubheading';
import { fetchImageList, fetchImageRequestStatus } from '../actions/images';
import useAlerts from '../hooks/use-alerts';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';
import {
  accessAlertTypes,
  ALERT_TYPE_ERROR,
  pageTitles,
  statsdFrontEndActions,
  studyJobStatus,
} from '../util/constants';
import { sendDataDogAction } from '../util/helpers';
import TrackedSpinner from '../components/shared/TrackedSpinner';
import { useTrackAction } from '../hooks/useTrackAction';

const RadiologyImagesList = ({ isTesting, basePath = '/labs-and-tests' }) => {
  const apiImagingPath = `${
    environment.API_URL
  }/my_health/v1/medical_records/imaging`;

  const isRadiologyDomain = basePath === '/imaging-results';
  const history = useHistory();
  const dispatch = useDispatch();

  const activeAlert = useAlerts(dispatch);

  const { labId } = useParams();

  const radiologyDetails = useSelector(
    state =>
      isRadiologyDomain
        ? state.mr.radiology.radiologyDetails
        : state.mr.labsAndTests.labsAndTestsDetails,
  );
  const radiologyList = useSelector(
    state => (isRadiologyDomain ? state.mr.radiology.radiologyList : null),
  );
  const imageList = useSelector(state => state.mr.images.imageList);
  const studyJobs = useSelector(state => state.mr.images.imageStatus);
  useTrackAction(statsdFrontEndActions.RADIOLOGY_IMAGES_LIST);

  const [isRadiologyDetailsLoaded, setRadiologyDetailsLoaded] = useState(
    isTesting || false,
  );
  const [isStudyJobsLoaded, setStudyJobsLoaded] = useState(isTesting || false);
  const [dicomDownloadStarted, setDicomDownloadStarted] = useState(false);
  const returnToDetailsPage = useCallback(
    () => history.push(`${basePath}/${labId}`),
    [history, labId, basePath],
  );

  const studyJob = useMemo(
    () =>
      studyJobs?.find(img => img.studyIdUrn === radiologyDetails?.studyId) ||
      null,
    [studyJobs, radiologyDetails?.studyId],
  );

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus()).then(() => {
        setStudyJobsLoaded(true);
      });
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (labId) {
        if (isRadiologyDomain) {
          dispatch(getRadiologyDetails(labId, radiologyList)).then(() => {
            setRadiologyDetailsLoaded(true);
          });
        } else {
          dispatch(getLabsAndTestsDetails(labId)).then(() => {
            setRadiologyDetailsLoaded(true);
          });
        }
      }
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_IMAGES_PAGE_TITLE);
    },
    [labId, dispatch, isRadiologyDomain, radiologyList],
  );

  useEffect(
    () => {
      // Make sure data has been loaded before possibly redirecting users based on missing data
      if (isRadiologyDetailsLoaded && isStudyJobsLoaded && studyJobs) {
        if (
          studyJob?.studyIdUrn &&
          studyJob?.status === studyJobStatus.COMPLETE
        ) {
          // Do not attempt to fetch the image list unless there is a completed study waiting in the backend.
          dispatch(fetchImageList(studyJob.studyIdUrn));
        } else {
          returnToDetailsPage();
        }
      }
    },
    [
      studyJobs,
      studyJob,
      isRadiologyDetailsLoaded,
      isStudyJobsLoaded,
      history,
      dispatch,
      returnToDetailsPage,
    ],
  );

  useEffect(
    () => {
      if (radiologyDetails?.imageCount === 0) {
        returnToDetailsPage();
      } else {
        focusElement('h1');
      }
    },
    [radiologyDetails, returnToDetailsPage],
  );

  const handleDicomDownload = () => {
    setDicomDownloadStarted(true);
    sendDataDogAction('Download DICOM files');
    document.querySelector('#download-banner');
  };

  const renderImageContent = () => (
    <>
      <PrintHeader />
      <h1 className="vads-u-margin-bottom--0" aria-describedby="radiology-date">
        {imageList && imageList.length > 0
          ? `Images: ${radiologyDetails.name}`
          : radiologyDetails.name}
      </h1>
      <DateSubheading
        label="Date and time performed"
        date={radiologyDetails?.date}
        id="radiology-date"
      />
      {radiologyDetails && (
        <ImageGallery
          imageList={imageList}
          studyId={radiologyDetails.studyId}
          imagesPerPage={10}
        />
      )}
      <h2>How to share images with a non-VA provider</h2>
      <p>
        The best way to share these images with a non-VA provider is to ask your
        VA care team to share them directly.
      </p>
      <p>
        If you want to try sharing these images yourself, you can download them
        as DICOM files in a ZIP folder.
      </p>
      <p>Here’s what to know:</p>
      <ul>
        <li>
          Your non-VA provider may not be able to accept these DICOM files from
          you. They may require your VA care team to share them directly.
        </li>
        <li>
          Providers use special software to view DICOM files, so you may not be
          able to view them on your device.
        </li>
        <li>
          These are large files that take a lot of storage space on your device.
          So we recommend downloading on a computer instead of a mobile phone.
        </li>
        <li>
          If you’re using a public or shared computer, remember that downloading
          saves a copy of your files to the computer you’re using.
        </li>
      </ul>
      {radiologyDetails?.studyId && (
        <>
          <va-banner
            id="download-banner"
            show-close={false}
            headline="Download started"
            type="success"
            visible={dicomDownloadStarted}
          >
            Check your device’s downloads location for your file.
          </va-banner>
          <p>
            <va-link
              download
              filetype="ZIP folder"
              href={`${apiImagingPath}/${radiologyDetails.studyId}/dicom`}
              text="Download DICOM files"
              onClick={handleDicomDownload}
            />
          </p>
        </>
      )}
    </>
  );

  if (activeAlert && activeAlert.type === ALERT_TYPE_ERROR) {
    return (
      <>
        <h1
          className="vads-u-margin-bottom--0"
          aria-describedby="radiology-date"
        >
          Images
          {radiologyDetails?.name && `: ${radiologyDetails.name}`}
        </h1>
        <AccessTroubleAlertBox
          alertType={accessAlertTypes.IMAGE_STATUS}
          className="vads-u-margin-bottom--9"
        />
      </>
    );
  }

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {radiologyDetails && studyJob?.status === studyJobStatus.COMPLETE ? (
        renderImageContent()
      ) : (
        <div className="vads-u-margin-y--8">
          <TrackedSpinner
            id="radiology-image-page-spinner"
            message="Loading..."
            setFocus
            data-testid="loading-indicator"
          />
        </div>
      )}
    </div>
  );
};

export default RadiologyImagesList;

RadiologyImagesList.propTypes = {
  basePath: PropTypes.string,
  isTesting: PropTypes.bool,
};
