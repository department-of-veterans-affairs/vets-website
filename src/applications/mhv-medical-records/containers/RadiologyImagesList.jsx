import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chunk } from 'lodash';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getlabsAndTestsDetails } from '../actions/labsAndTests';
import PrintDownload from '../components/shared/PrintDownload';
import PrintHeader from '../components/shared/PrintHeader';
import DownloadingRecordsInfo from '../components/shared/DownloadingRecordsInfo';
import GenerateRadiologyPdf from '../components/LabsAndTests/GenerateRadiologyPdf';
import DateSubheading from '../components/shared/DateSubheading';

const RadiologyImagesList = () => {
  const dispatch = useDispatch();
  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );
  const { labId } = useParams();
  const [currentImageCount, setCurrentImageCount] = useState(5);
  const labAndTestDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );

  const downloadPdf = () => {
    GenerateRadiologyPdf(labAndTestDetails);
  };

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          {
            url: `/labs-and-tests/${labId}`,
            label: labAndTestDetails?.name,
          },
        ]),
      );
    },
    [labAndTestDetails?.name, labId, dispatch],
  );

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId));
      }
    },
    [labId, dispatch],
  );

  const content = () => {
    if (labAndTestDetails) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0"
            aria-describedby="radiology-date"
          >
            Images: {labAndTestDetails.name}
          </h1>
          <DateSubheading date={labAndTestDetails?.date} id="radiology-date" />

          <div className="no-print">
            <PrintDownload
              downloadPdf={downloadPdf}
              allowTxtDownloads={allowTxtDownloads}
            />
            <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
          </div>

          <div className="vads-u-padding--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-l-grid-container vads-l-row vads-u-margin-bottom--2">
            {chunk(labAndTestDetails.images, currentImageCount)[0].map(
              (image, idx) => (
                <div
                  className="image-div vads-l-col--4"
                  data-testid="image-div"
                  key={idx}
                >
                  <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--h3">
                    Image {idx + 1} of {labAndTestDetails.images.length}
                  </h2>
                  <div
                    className="vads-u-padding-x--3 vads-u-padding-y--7 vads-u-background-color--black vads-u-margin-y--0p5"
                    aria-label={image}
                  >
                    <br className="vads-u-margin-y--4" />
                  </div>
                  <va-link
                    className="vads-u-margin-top--1"
                    active
                    href={`/my-health/medical-records/labs-and-tests/${labId}/images/${idx +
                      1}`}
                    text="Review full image"
                  />
                </div>
              ),
            )}
          </div>
          {currentImageCount < labAndTestDetails.images.length && (
            <button
              className="load-more-button"
              type="button"
              onClick={() => setCurrentImageCount(currentImageCount + 5)}
            >
              Load 5 more images
            </button>
          )}
        </>
      );
    }
    return <></>;
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {content()}
    </div>
  );
};

export default RadiologyImagesList;
