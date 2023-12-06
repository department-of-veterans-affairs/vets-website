import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const SpouseBenefitReview = ({ data, title }) => {
  const { benefits } = data;
  const { spouseBenefits } = benefits;
  const { education, compensationAndPension } = spouseBenefits;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Month disability compensation and pension benefits</dt>
          <dd>{currencyFormatter(compensationAndPension)}</dd>
        </div>
        <div className="review-row">
          <dt>Month education benefitse</dt>
          <dd>{currencyFormatter(education)}</dd>
        </div>
      </dl>
    </div>
  );
};

SpouseBenefitReview.propTypes = {
  data: PropTypes.shape({
    benefits: PropTypes.shape({
      spouseBenefits: PropTypes.shape({
        compensationAndPension: PropTypes.string,
        education: PropTypes.string,
      }),
    }),
  }),
  title: PropTypes.string,
};

export default SpouseBenefitReview;
