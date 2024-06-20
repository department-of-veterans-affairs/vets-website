import React from 'react';
import PropTypes from 'prop-types';

const BankruptcyDetailsReview = ({ data, title }) => {
  const {
    additionalData: {
      bankruptcy: {
        courtLocation = '',
        docketNumber = '',
        dateDischarged = '',
      },
    },
  } = data;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Date a court granted you a bankruptcy discharge</dt>
          <dd>{dateDischarged}</dd>
        </div>
        <div className="review-row">
          <dt>Location of court (city, state)</dt>
          <dd>{courtLocation}</dd>
        </div>
        <div className="review-row">
          <dt>Case or docket number</dt>
          <dd>{docketNumber}</dd>
        </div>
      </dl>
    </div>
  );
};

BankruptcyDetailsReview.propTypes = {
  data: PropTypes.shape({
    additionalData: PropTypes.shape({
      bankruptcy: PropTypes.shape({
        courtLocation: PropTypes.string,
        dateDischarged: PropTypes.string,
        docketNumber: PropTypes.string,
      }),
    }),
  }),
  goToPath: PropTypes.func,
  title: PropTypes.string,
};

export default BankruptcyDetailsReview;
