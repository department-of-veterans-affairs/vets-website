import React from 'react';

import { getLabel } from '../../utils/helpers';
import { yesNoNA } from '../../utils/options-for-select';

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
              <td>Are you receiving, or do you anticipate receiving, any money (including but not limited to federal tuition assistance) from the armed forces or public health services for the course for which you have applied to the VA for education benefits?</td>
              <td>{this.props.data.currentlyActiveDuty.nonVaAssistance.value === 'Y' ? 'Yes' : 'No'}</td>
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
                <td>Do not apply this period of service to my selected benefit:</td>
                <td>{tour.doNotApplyPeriodToSelected ? 'Yes' : 'No'}</td>
              </tr>
              {tour.doNotApplyPeriodToSelected
                ? <tbody>
                  <tr>
                    <td>Which benefit should this period of service be applied to?</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Chapter 30</td>
                    <td>{tour.applyToChapter30 ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>Chapter 1606</td>
                    <td>{tour.applyToChapter1606 ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>Chapter 32 / Section 903</td>
                    <td>{tour.applyToChapter32 ? 'Yes' : 'No'}</td>
                  </tr>
                </tbody>
                : null}
              <tr>
                <td>From date:</td>
                <td>{tour.fromDate.month.value ? `${tour.fromDate.month.value}/${tour.fromDate.day.value}/${tour.fromDate.year.value}` : null}</td>
              </tr>
              <tr>
                <td>To date:</td>
                <td>{tour.toDate.month.value ? `${tour.toDate.month.value}/${tour.toDate.day.value}/${tour.toDate.year.value}` : null}</td>
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
