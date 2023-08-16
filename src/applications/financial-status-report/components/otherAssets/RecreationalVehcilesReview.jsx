import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const RecreationalVehiclesReview = ({ data, title }) => {
  const { assets } = data;
  const { recVehicleAmount } = assets;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Estimated value</dt>
          <dd>{currencyFormatter(recVehicleAmount)}</dd>
        </div>
      </dl>
    </div>
  );
};

RecreationalVehiclesReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      recVehicleAmount: PropTypes.string,
    }),
  }),
  title: PropTypes.string,
};

export default RecreationalVehiclesReview;
