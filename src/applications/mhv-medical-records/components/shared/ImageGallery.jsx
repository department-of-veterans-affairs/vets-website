import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { chunk } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PrintDownload from './PrintDownload';
import PrintHeader from './PrintHeader';
import DownloadingRecordsInfo from './DownloadingRecordsInfo';
import DateSubheading from './DateSubheading';
import GenerateRadiologyPdf from '../LabsAndTests/GenerateRadiologyPdf';

const ImageGallery = ({ record, imageList, imageCount, study, print }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const apiImagingPath = `${
    environment.API_URL
  }/my_health/v1/medical_records/imaging`;
  const pageCount = Math.ceil(imageList.length / imageCount);
  const downloadPdf = () => {
    GenerateRadiologyPdf(record);
  };

  const allowTxtDownloads = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvMedicalRecordsAllowTxtDownloads
      ],
  );

  const onPageChange = page => {
    setCurrentPage(page);
  };

  const content = () => {
    if (imageList.length) {
      return (
        <>
          <PrintHeader />
          <h1
            className="vads-u-margin-bottom--0"
            aria-describedby="radiology-date"
          >
            Images: {record.name}
          </h1>
          <DateSubheading date={record?.date} id="radiology-date" />

          {print && (
            <div className="no-print">
              <PrintDownload
                downloadPdf={downloadPdf}
                allowTxtDownloads={allowTxtDownloads}
              />
              <DownloadingRecordsInfo allowTxtDownloads={allowTxtDownloads} />
            </div>
          )}

          <div className="vads-u-padding--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-l-grid-container vads-l-row vads-u-margin-bottom--2">
            {chunk(imageList, imageCount)[currentPage - 1].map((image, idx) => (
              <div
                className="image-div vads-l-col--4"
                data-testid="image-div"
                key={idx}
              >
                <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--h3">
                  Image {image.index} of {imageList.length}
                </h2>
                <div
                  className="vads-u-padding-x--1 vads-u-padding-y--1 vads-u-background-color--black vads-u-margin-y--0p5"
                  aria-label={image.index}
                >
                  <img
                    src={`${apiImagingPath}/${study}/images/${
                      image.seriesAndImage
                    }`}
                    alt={`${image.index} - ${image.seriesAndImage}`}
                  />
                </div>
              </div>
            ))}
          </div>
          {imageCount < imageList.length && (
            <VaPagination
              onPageSelect={e => onPageChange(e.detail.page)}
              page={currentPage}
              pages={pageCount}
              maxPageListLength={5}
              showLastPage
              uswds
            />
          )}
        </>
      );
    }
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          message="Loading..."
          setFocus
          data-testid="loading-indicator"
        />
      </div>
    );
  };

  return <div className="vads-u-margin-bottom--5">{content()}</div>;
};

export default ImageGallery;
