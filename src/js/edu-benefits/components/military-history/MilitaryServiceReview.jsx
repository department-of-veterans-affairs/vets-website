import React from 'react';

import { getLabel, displayDateIfValid, showYesNo } from '../../utils/helpers';
import { yesNo } from '../../utils/options-for-select';

export default class MilitaryServiceReview extends React.Component {
  render() {
    return (
      <div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>If you received a commission from a military service academy, what year did you graduate?</td>
              <td>{this.props.data.serviceAcademyGraduationYear.value}</td>
            </tr>
            <tr>
              <td>Are you currently on active duty?</td>
              <td>{showYesNo(this.props.data.currentlyActiveDuty.yes)}</td>
            </tr>
          </tbody>
          {this.props.data.currentlyActiveDuty.yes.value === 'Y'
            ? <tbody>
              <tr>
                <td>Are you currently on terminal leave?</td>
                <td>{showYesNo(this.props.data.currentlyActiveDuty.onTerminalLeave)}</td>
              </tr>
            </tbody>
            : null}
        </table>
        {this.props.data.toursOfDuty.map((tour, index) => {
          return (<table key={index} className="review usa-table-borderless">
            <thead>
              <tr>
                <td scope="col">Tour - {tour.serviceBranch.value}</td>
                <td scope="col"></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>From date:</td>
                <td>{displayDateIfValid(tour.dateRange.from)}</td>
              </tr>
              <tr>
                <td>To date:</td>
                <td>{displayDateIfValid(tour.dateRange.to)}</td>
              </tr>
              <tr>
                <td>Service status:</td>
                <td>{tour.serviceStatus.value}</td>
              </tr>
              <tr>
                <td>Were you involuntarily called for active duty during this period?</td>
                <td>{getLabel(yesNo, tour.involuntarilyCalledToDuty.value)}</td>
              </tr>
              <tr>
                <td>Apply this service period to the benefit I'm applying for</td>
                <td>{tour.applyPeriodToSelected ? 'Yes' : 'No'}</td>
              </tr>
              {!tour.applyPeriodToSelected
                ? <tr>
                  <td>Please explain how you'd like this service period applied.</td>
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

MilitaryServiceReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
