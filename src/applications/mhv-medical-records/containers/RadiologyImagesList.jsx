import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { getlabsAndTestsDetails } from '../actions/labsAndTests';
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
} from '../util/constants';

const RadiologyImagesList = () => {
  const apiImagingPath = `${
    environment.API_URL
  }/my_health/v1/medical_records/imaging`;

  const dispatch = useDispatch();

  const activeAlert = useAlerts(dispatch);

  const { labId } = useParams();

  const radiologyDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const imageList = useSelector(state => state.mr.images.imageList);

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId));
      }
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_IMAGES_PAGE_TITLE);
    },
    [labId, dispatch],
  );

  useEffect(
    () => {
      if (radiologyDetails) {
        dispatch(fetchImageList(radiologyDetails.studyId));
      }
    },
    [dispatch, radiologyDetails],
  );

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus());
    },
    [dispatch],
  );

  const content = () => (
    <>
      <PrintHeader />
      <h1 className="vads-u-margin-bottom--0" aria-describedby="radiology-date">
        Images: {radiologyDetails.name}
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
        If you want to try to sharing these images yourself, you can download
        them as DICOM files in a ZIP folder.
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
      <p>
        {radiologyDetails?.studyId && (
          <va-link
            download
            filetype="ZIP folder"
            href={`${apiImagingPath}/${radiologyDetails.studyId}/dicom`}
            text="Download DICOM files"
          />
        )}
      </p>
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
      {radiologyDetails ? (
        content()
      ) : (
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
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
