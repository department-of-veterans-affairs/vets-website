import React from 'react';
import { displayMonthYearIfValid } from '../../../utils/helpers';

export default class EducationPeriodReview extends React.Component {
  render() {
    const period = this.props.period;

    if (period.name.value) {
      return (<div className="review-growable">
        <table className="review usa-table-borderless">
          <tbody className="edu-growable-review-desc">
            <tr>
              <td>{period.name.value}<br/>
              {displayMonthYearIfValid(period.dateRange.from)} &mdash; {displayMonthYearIfValid(period.dateRange.to)}</td>
              <td>
                <button className="usa-button-outline float-right" onClick={this.props.onEdit}>Edit</button>
              </td>
            </tr>
          </tbody>
          <tbody className="edu-growable-expanded">
            <tr>
              <td scope="col">City</td>
              <td scope="col">{period.city.value}</td>
            </tr>
            <tr>
              <td scope="col">State</td>
              <td scope="col">{period.state.value}</td>
            </tr>
            <tr>
              <td scope="col">Hours completed</td>
              <td scope="col">{period.hours.value}</td>
            </tr>
            <tr>
              <td scope="col">Type of hours</td>
              <td scope="col">{period.hoursType.value}</td>
            </tr>
            <tr>
              <td scope="col">Name of degree, diploma, or certificate</td>
              <td scope="col">{period.degreeReceived.value}</td>
            </tr>
            <tr>
              <td scope="col">Major or course of study</td>
              <td scope="col">{period.major.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
      );
    }

    return (<div className="review-growable">
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>This entry may be missing information</td>
            <td>
              <button className="usa-button-outline float-right" onClick={this.props.onEdit}>Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    );
  }
}

EducationPeriodReview.propTypes = {
  period: React.PropTypes.object.isRequired,
  onEdit: React.PropTypes.func
};
