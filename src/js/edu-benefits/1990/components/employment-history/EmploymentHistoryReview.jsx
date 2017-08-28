import PropTypes from 'prop-types';
import React from 'react';

import { showYesNo } from '../../../utils/helpers';

export default class EmploymentHistoryReview extends React.Component {
  render() {
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
              <td>Have you ever held a license or a journeyman rating (for example, as a contractor or plumber) to practice a profession?</td>
              <td>{showYesNo(this.props.data.hasNonMilitaryJobs)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

EmploymentHistoryReview.propTypes = {
  data: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};
