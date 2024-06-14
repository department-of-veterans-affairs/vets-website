import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import React from 'react';
import { setData } from 'platform/forms-system/src/js/actions';

import VeteranInfoBox from './VeteranInfoBox';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const VeteranInformationReview = ({ data, goToPath, title }) => {
  const dispatch = useDispatch();
  const {
    personalData,
    personalIdentification,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const {
    veteranFullName: { first, last, middle },
    dateOfBirth,
  } = personalData;
  const { ssn, fileNumber } = personalIdentification;

  // set reviewNavigation to true to show the review page alert
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: true,
      }),
    );
    goToPath('/veteran-information');
  };

  return (
    <>
      {showReviewNavigation ? (
        <ReviewPageHeader
          title="veteran information"
          goToPath={onReviewClick}
        />
      ) : null}
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h4>
        </div>
        <div className="review-top-bottom-borders vads-u-margin-y--2">
          <VeteranInfoBox
            first={first}
            middle={middle}
            last={last}
            dateOfBirth={dateOfBirth}
            ssnLastFour={ssn}
            fileNumber={fileNumber}
          />
        </div>
      </div>
    </>
  );
};

VeteranInformationReview.propTypes = {
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      veteranFullName: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string,
        middle: PropTypes.string,
      }),
      dateOfBirth: PropTypes.string,
    }),
    personalIdentification: PropTypes.shape({
      ssn: PropTypes.string,
      fileNumber: PropTypes.string,
    }),
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goToPath: PropTypes.func,
  title: PropTypes.string,
};

export default VeteranInformationReview;
