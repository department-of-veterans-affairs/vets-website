import React from 'react';

import { yesNoNA } from '../../utils/options-for-select';
import { getLabel, showYesNo } from '../../utils/helpers';

export default class RotcHistoryReview extends React.Component {
  render() {
    return (
      <div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Are you in a senior ROTC scholarship program right now that pays your tuition, fees, books, and supplies? (Covered under Section 2107 of Title 10, U.S. Code)</td>
              <td>{showYesNo(this.props.data.seniorRotcScholarshipProgram)}</td>
            </tr>
            <tr>
              <td>Were you commissioned as a result of senior ROTC?</td>
              <td>{getLabel(yesNoNA, this.props.data.seniorRotcCommissioned.value)}</td>
            </tr>
            {this.props.data.seniorRotcCommissioned.value === 'Y'
              ? <tr>
                <td>Year of commission:</td>
                <td>{this.props.data.seniorRotc.commissionYear.value}</td>
              </tr>
              : null}
          </tbody>
        </table>
        {this.props.data.seniorRotcCommissioned.value === 'Y' && this.props.data.seniorRotc.rotcScholarshipAmounts.map((scholarship, index) => {
          return (<table key={index} className="review usa-table-borderless">
            <thead>
              <tr>
                <td scope="col">Scholarship amount - ${scholarship.amount.value}</td>
                <td scope="col"></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Year:</td>
                <td>{scholarship.year.value}</td>
              </tr>
            </tbody>
          </table>
          );
        })}
      </div>
    );
  }
}

RotcHistoryReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
