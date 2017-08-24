import PropTypes from 'prop-types';
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
              <td>City</td>
              <td>{period.city.value}</td>
            </tr>
            <tr>
              <td>State</td>
              <td>{period.state.value}</td>
            </tr>
            <tr>
              <td>Hours completed</td>
              <td>{period.hours.value}</td>
            </tr>
            <tr>
              <td>Type of hours</td>
              <td>{period.hoursType.value}</td>
            </tr>
            <tr>
              <td>Name of degree, diploma, or certificate</td>
              <td>{period.degreeReceived.value}</td>
            </tr>
            <tr>
              <td>Major or course of study</td>
              <td>{period.major.value}</td>
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
  period: PropTypes.object.isRequired,
  onEdit: PropTypes.func
};
