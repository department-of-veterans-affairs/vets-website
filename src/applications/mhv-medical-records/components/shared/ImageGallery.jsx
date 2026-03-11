import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import TrackedSpinner from './TrackedSpinner';

/**
 * Paginated image gallery shared by both CVIX and SCDF radiology views.
 *
 * @param {Array}    imageList      - Items with at least an `index` property.
 * @param {number}   imagesPerPage  - Images shown per page (default 10).
 * @param {string}   [studyId]      - CVIX study ID (used by the default src builder).
 * @param {Function} [buildImageSrc] - `(image) => string` that returns the <img> src.
 *   When omitted the component falls back to the legacy CVIX URL pattern using `studyId`.
 */
const ImageGallery = ({ imageList, imagesPerPage, studyId, buildImageSrc }) => {
  const apiImagingPath = `${
    environment.API_URL
  }/my_health/v1/medical_records/imaging`;

  // Default src builder: CVIX URL pattern (backward-compatible).
  const getImageSrc =
    buildImageSrc ||
    (image => `${apiImagingPath}/${studyId}/images/${image.seriesAndImage}`);

  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(imageList.length / imagesPerPage);

  const paginatedImages = useMemo(() => chunk(imageList, imagesPerPage), [
    imageList,
    imagesPerPage,
  ]);

  const onPageChange = page => {
    if (page > 0 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  const hasImages = imageList.length && imagesPerPage;
  // The gallery is ready when a custom src builder is provided OR a studyId exists.
  const isReady = hasImages && (buildImageSrc || studyId);

  const content = () => {
    if (isReady) {
      const pageImages = paginatedImages[currentPage - 1];
      return (
        <>
          <div data-testid="showing-image-records">
            <span>
              Showing {pageImages[0].index} to{' '}
              {pageImages[0].index + (pageImages.length - 1)} of{' '}
              {imageList.length} {imageList.length === 1 ? 'image' : 'images'}
            </span>
          </div>
          <div className="vads-u-padding--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-l-grid-container vads-l-row vads-u-margin-bottom--2">
            {pageImages.map((image, idx) => (
              <div
                className="image-div vads-l-col--6"
                data-testid="image-div"
                key={idx}
              >
                <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--h3">
                  Image {image.index} of {imageList.length}
                </h2>
                <div className="vads-u-padding-x--1 vads-u-padding-y--1 vads-u-background-color--black vads-u-margin-y--0p5">
                  <img
                    src={getImageSrc(image)}
                    alt={`${image.index}, Details not provided`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="vads-u-margin-bottom--2 no-print">
            <VaPagination
              onPageSelect={e => onPageChange(e.detail.page)}
              page={currentPage}
              pages={pageCount}
              showLastPage
              uswds
            />
          </div>
        </>
      );
    }
    return (
      <div className="vads-u-margin-y--8">
        <TrackedSpinner
          id="radiology-image-gallery-spinner"
          message="Loading..."
          set-focus
          data-testid="loading-indicator"
        />
      </div>
    );
  };

  return <div className="vads-u-margin-bottom--5">{content()}</div>;
};

export default ImageGallery;

ImageGallery.propTypes = {
  buildImageSrc: PropTypes.func,
  imageList: PropTypes.array,
  imagesPerPage: PropTypes.number,
  studyId: PropTypes.string,
};
