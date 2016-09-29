import React from 'react';

import { getLabel, displayDateIfValid } from '../../utils/helpers';
import { yesNoNA, tourBenefits } from '../../utils/options-for-select';

export default class MilitaryServiceReview extends React.Component {
  render() {
    return (
      <div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>If you graduated from a military service academy, what year did you graduate?</td>
              <td>{this.props.data.serviceAcademyGraduationYear.value}</td>
            </tr>
            <tr>
              <td>Are you on active duty?</td>
              <td>{this.props.data.currentlyActiveDuty.yes.value === 'Y' ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Are you on terminal leave?</td>
              <td>{this.props.data.currentlyActiveDuty.onTerminalLeave.value === 'Y' ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Are you receiving, or do you expect to receive any money (including, but not limited to, federal tuition assistance) from the armed forces or public health services for any part of your coursework?</td>
              <td>{this.props.data.currentlyActiveDuty.nonVaAssistance.value === 'Y' ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td>Were you commissioned as a result of senior ROTC?</td>
              <td>{getLabel(yesNoNA, this.props.data.seniorRotcCommissioned.value)}</td>
            </tr>
          </tbody>
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
                <td>This period of service should be counted towards another education benefit.</td>
                <td>{tour.doNotApplyPeriodToSelected ? 'Yes' : 'No'}</td>
              </tr>
              {tour.doNotApplyPeriodToSelected
                ? <tr>
                  <td>Which benefit should this period of service be applied to?</td>
                  <td>{getLabel(tourBenefits, tour.benefitsToApplyTo.value)}</td>
                </tr>
                : null}
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
                <td>{getLabel(yesNoNA, tour.involuntarilyCalledToDuty.value)}</td>
              </tr>
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
