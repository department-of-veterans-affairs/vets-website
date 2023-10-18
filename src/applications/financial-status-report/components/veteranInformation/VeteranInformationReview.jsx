import PropTypes from 'prop-types';
import React from 'react';
import VeteranInfoBox from './VeteranInfoBox';

const VeteranInformationReview = ({ data, title }) => {
  const { personalData, personalIdentification } = data;
  const {
    veteranFullName: { first, last, middle },
    dateOfBirth,
  } = personalData;
  const { ssn, fileNumber } = personalIdentification;

  return (
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
  }),
  title: PropTypes.string,
};

export default VeteranInformationReview;
