import PropTypes from 'prop-types';
import React from 'react';
import { displayMonthYearIfValid } from '../../../utils/helpers';

export default class EducationHistoryReview extends React.Component {
  render() {
    const completionDate = this.props.data.highSchoolOrGedCompletionDate;
    return (
      <div>
        <div className="form-review-panel-page-header-row">
          <div className="form-review-panel-page-header"/>
          <button
              className="edit-btn primary-outline"
              onClick={this.props.onEdit}>Edit</button>
        </div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>If you got a high school diploma or high school equivalency certificate, what date did you get it? (month, year)</td>
              <td>{displayMonthYearIfValid(completionDate)}</td>
            </tr>
            <tr>
              <td>FAA certificates</td>
              <td className="schemaform-address-view">{this.props.data.faaFlightCertificatesInformation.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

EducationHistoryReview.propTypes = {
  data: PropTypes.object.isRequired
};
