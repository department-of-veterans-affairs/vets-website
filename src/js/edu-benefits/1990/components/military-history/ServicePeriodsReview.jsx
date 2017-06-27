import PropTypes from 'prop-types';
import React from 'react';

import { displayDateIfValid } from '../../../utils/helpers';

export default class ServicePeriodsReview extends React.Component {
  render() {
    const tour = this.props.tour;
    return (
      <div className="review-growable">
        <table className="review usa-table-borderless">
          <tbody className="edu-growable-review-desc">
            <tr>
              <td>
                <strong>{tour.serviceBranch.value}</strong><br/>
                {displayDateIfValid(tour.dateRange.from)} &mdash; {displayDateIfValid(tour.dateRange.to)}
              </td>
              <td>
                <button className="usa-button-outline float-right" onClick={this.props.onEdit}>Edit</button>
              </td>
            </tr>
          </tbody>
          <tbody className="edu-growable-expanded">
            <tr>
              <td>Service status:</td>
              <td>{tour.serviceStatus.value}</td>
            </tr>
            <tr>
              <td>Apply this service period to the benefit I’m applying for.</td>
              <td>{tour.applyPeriodToSelected ? 'Yes' : 'No'}</td>
            </tr>
            {!tour.applyPeriodToSelected
              ? <tr>
                <td>Please explain how you’d like this service period applied.</td>
                <td className="schemaform-address-view">{tour.benefitsToApplyTo.value}</td>
              </tr>
              : null}
          </tbody>
        </table>
      </div>
    );
  }
}

ServicePeriodsReview.propTypes = {
  tour: PropTypes.object.isRequired,
  onEdit: PropTypes.func
};
