import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const VehicleSummaryReview = ({ data, title }) => {
  const { automobiles = [] } = data.assets;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>

      <dl className="review">
        {automobiles.map((vehicle, index) => {
          return (
            <div
              className="review-row"
              key={vehicle.make + vehicle.resaleValue + index}
            >
              <dt>
                {`${vehicle.year ? `${vehicle.year} ` : ''}${vehicle.make} ${
                  vehicle.model
                }`}
              </dt>
              <dd>{currencyFormatter(vehicle.resaleValue)}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

VehicleSummaryReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      automobiles: PropTypes.array,
    }),
  }),
  title: PropTypes.string,
};

export default VehicleSummaryReview;
