import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import TrackedSpinner from './TrackedSpinner';

const ImageGallery = ({ imageList, imagesPerPage, studyId }) => {
  const apiImagingPath = `${environment.API_URL}/my_health/v1/medical_records/imaging`;

  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(imageList.length / imagesPerPage);

  const paginatedImages = useMemo(
    () => chunk(imageList, imagesPerPage),
    [imageList, imagesPerPage],
  );

  const onPageChange = page => {
    if (page > 0 && page <= pageCount) {
      setCurrentPage(page);
    }
  };

  const content = () => {
    if (imageList.length && imagesPerPage && studyId) {
      return (
        <>
          <div data-testid="showing-image-records">
            <span>
              {`Showing ${paginatedImages[currentPage - 1][0].index} to ${
                paginatedImages[currentPage - 1][0].index +
                (paginatedImages[currentPage - 1].length - 1)
              } of ${imageList.length} images`}
            </span>
          </div>
          <div className="vads-u-padding--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-l-grid-container vads-l-row vads-u-margin-bottom--2">
            {paginatedImages[currentPage - 1].map((image, idx) => (
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
                    src={`${apiImagingPath}/${studyId}/images/${image.seriesAndImage}`}
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
  imageList: PropTypes.array,
  imagesPerPage: PropTypes.number,
  studyId: PropTypes.string,
};
