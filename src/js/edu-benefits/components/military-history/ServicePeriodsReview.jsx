import React from 'react';

import { displayDateIfValid } from '../../utils/helpers';

export default class ServicePeriodsReview extends React.Component {
  render() {
    return (
      <div>
        {this.props.data.toursOfDuty.map((tour, index) => {
          return (<table key={index} className="review usa-table-borderless">
            <thead>
              <tr>
                <td scope="col">Service Period - {tour.serviceBranch.value}</td>
                <td scope="col"></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Service status:</td>
                <td>{tour.serviceStatus.value}</td>
              </tr>
              <tr>
                <td>From date:</td>
                <td>{displayDateIfValid(tour.dateRange.from)}</td>
              </tr>
              <tr>
                <td>To date:</td>
                <td>{displayDateIfValid(tour.dateRange.to)}</td>
              </tr>
              <tr>
                <td>Apply this service period to the benefit I’m applying for.</td>
                <td>{tour.applyPeriodToSelected ? 'Yes' : 'No'}</td>
              </tr>
              {!tour.applyPeriodToSelected
                ? <tr>
                  <td>Please explain how you’d like this service period applied.</td>
                  <td className="edu-benefits-pre">{tour.benefitsToApplyTo.value}</td>
                </tr>
                : null}
            </tbody>
          </table>
          );
        })}
      </div>
    );
  }
}

ServicePeriodsReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
