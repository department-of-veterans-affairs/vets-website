import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  getLabsAndTestsDetails,
  getImagingStudyThumbnails,
  getImagingStudyDicomZip,
} from '../actions/labsAndTests';
import { buildThumbnailProxyUrl } from '../api/MrApi';
import PrintHeader from '../components/shared/PrintHeader';
import DateSubheading from '../components/shared/DateSubheading';
import ImageGallery from '../components/shared/ImageGallery';
import {
  pageTitles,
  ALERT_TYPE_IMAGE_THUMBNAIL_ERROR,
} from '../util/constants';
import { sendDataDogAction } from '../util/helpers';
import useAlerts from '../hooks/use-alerts';

const ScdfRadiologyImagesList = ({ isTesting }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { labId } = useParams();

  const labAndTestDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const labAndTestList = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );
  const scdfImageThumbnails = useSelector(
    state => state.mr.labsAndTests.scdfImageThumbnails,
  );
  const scdfDicom = useSelector(state => state.mr.labsAndTests.scdfDicom);
  const activeAlert = useAlerts(dispatch);
  const hasImageError = activeAlert?.type === ALERT_TYPE_IMAGE_THUMBNAIL_ERROR;

  const [isDetailsLoaded, setDetailsLoaded] = useState(isTesting || false);
  const [dicomDownloadStarted, setDicomDownloadStarted] = useState(false);

  // Convert thumbnail URL strings into { index, thumbnailUrl } objects for ImageGallery.
  const imageList = useMemo(
    () =>
      scdfImageThumbnails
        ? scdfImageThumbnails.map((url, i) => ({
            index: i + 1,
            thumbnailUrl: url,
          }))
        : [],
    [scdfImageThumbnails],
  );

  const buildImageSrc = image => buildThumbnailProxyUrl(image.thumbnailUrl);

  // Fetch the record details if we navigated directly to this page.
  useEffect(
    () => {
      if (labId) {
        dispatch(getLabsAndTestsDetails(labId, labAndTestList, true)).then(
          () => {
            setDetailsLoaded(true);
          },
        );
      }
      updatePageTitle(pageTitles.LAB_AND_TEST_RESULTS_IMAGES_PAGE_TITLE);
    },
    [labId, labAndTestList, dispatch],
  );

  // Once details are loaded, fetch thumbnails and DICOM if not already present.
  useEffect(
    () => {
      if (isDetailsLoaded && labAndTestDetails?.imagingStudyId) {
        if (!scdfImageThumbnails?.length) {
          dispatch(getImagingStudyThumbnails(labAndTestDetails.imagingStudyId));
        }
        if (scdfDicom == null) {
          dispatch(getImagingStudyDicomZip(labAndTestDetails.imagingStudyId));
        }
      }
    },
    [
      isDetailsLoaded,
      labAndTestDetails?.imagingStudyId,
      scdfImageThumbnails,
      scdfDicom,
      dispatch,
    ],
  );

  // Focus on heading once images are loaded.
  useEffect(
    () => {
      if (labAndTestDetails && scdfImageThumbnails) {
        requestAnimationFrame(() => {
          focusElement(document.querySelector('h1'));
        });
      }
    },
    [labAndTestDetails, scdfImageThumbnails],
  );

  // If the record has no imaging study, redirect back.
  useEffect(
    () => {
      if (isDetailsLoaded && !labAndTestDetails?.imagingStudyId) {
        history.push(`/labs-and-tests/${labId}`);
      }
    },
    [isDetailsLoaded, labAndTestDetails?.imagingStudyId, history, labId],
  );

  const handleDicomDownload = () => {
    setDicomDownloadStarted(true);
    sendDataDogAction('Download DICOM files');
  };

  const renderImageContent = () => (
    <>
      <PrintHeader />
      <h1 className="vads-u-margin-bottom--0" aria-describedby="radiology-date">
        {imageList.length > 0
          ? `Images: ${labAndTestDetails.name}`
          : labAndTestDetails.name}
      </h1>
      <DateSubheading
        label="Date and time performed"
        date={labAndTestDetails?.date}
        id="radiology-date"
      />

      {/*                    IMAGE GALLERY                         */}
      {imageList.length > 0 && (
        <ImageGallery
          imageList={imageList}
          imagesPerPage={10}
          buildImageSrc={buildImageSrc}
        />
      )}

      {/*                    DICOM DOWNLOAD                        */}
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
      {scdfDicom && (
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
              href={scdfDicom}
              text="Download DICOM files"
              onClick={handleDicomDownload}
            />
          </p>
        </>
      )}
    </>
  );

  const renderImagesError = () => (
    <va-alert status="error" visible data-testid="image-request-error-alert">
      <h3 slot="headline">We couldn’t load your images</h3>
      <p>Try again later.</p>
      <p>
        If it still doesn’t work, call us at{' '}
        <va-telephone contact="8773270022" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  );

  const isReady = labAndTestDetails && (scdfImageThumbnails || hasImageError);

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {isReady ? (
        <>
          {hasImageError && renderImagesError()}
          {renderImageContent()}
        </>
      ) : (
        <div className="vads-u-margin-y--8">
          <va-loading-indicator
            message="Loading..."
            set-focus
            data-testid="loading-indicator"
          />
        </div>
      )}
    </div>
  );
};

export default ScdfRadiologyImagesList;

ScdfRadiologyImagesList.propTypes = {
  isTesting: PropTypes.bool,
};
