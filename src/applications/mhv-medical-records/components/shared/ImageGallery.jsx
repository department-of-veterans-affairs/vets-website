import React, { useState } from 'react';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { chunk } from 'lodash';

const ImageGallery = ({ imageList, imageCount, studyId }) => {
  const apiImagingPath = `${
    environment.API_URL
  }/my_health/v1/medical_records/imaging`;

  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(imageList.length / imageCount);

  const onPageChange = page => {
    setCurrentPage(page);
  };

  const content = () => {
    if (imageList.length && studyId) {
      return (
        <>
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
                    src={`${apiImagingPath}/${studyId}/images/${
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

ImageGallery.propTypes = {
  imageCount: PropTypes.number,
  imageList: PropTypes.array,
  studyId: PropTypes.string,
};
