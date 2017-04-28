import PropTypes from 'prop-types';
import React from 'react';

import { getLabel } from '../../../utils/helpers';
import { employmentPeriodTiming } from '../../utils/options-for-select';

export default class EmploymentHistoryReview extends React.Component {
  render() {
    const period = this.props.period;
    if (period.name.value) {
      return (<div className="review-growable">
        <table className="review usa-table-borderless">
          <tbody className="edu-growable-review-desc">
            <tr>
              <td><strong>{period.name.value}</strong><br/>{getLabel(employmentPeriodTiming, period.postMilitaryJob.value)}</td>
              <td>
                <button className="usa-button-outline float-right" onClick={this.props.onEdit}>Edit</button>
              </td>
            </tr>
          </tbody>
          <tbody className="edu-growable-expanded">
            <tr>
              <td>Number of months worked:</td>
              <td>{period.months.value}</td>
            </tr>
            <tr>
              <td>Licenses or rating:</td>
              <td>{period.licenseOrRating.value}</td>
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

EmploymentHistoryReview.propTypes = {
  period: PropTypes.object.isRequired,
  onEdit: PropTypes.func
};
