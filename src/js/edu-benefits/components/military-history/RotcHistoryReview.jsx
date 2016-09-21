import React from 'react';

export default class RotcHistoryReview extends React.Component {
  render() {
    return (
      <div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Year of commission</td>
              <td>{this.props.data.seniorRotc.yearOfCommission.value}</td>
            </tr>
          </tbody>
        </table>
        {this.props.data.seniorRotc.rotcScholarshipAmounts.map((scholarship, index) => {
          return (<table key={index} className="review usa-table-borderless">
            <thead>
              <tr>
                <td scope="col">Scholarship - ${scholarship.amount.value}</td>
                <td scope="col"></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Year received:</td>
                <td>{scholarship.year.value}</td>
              </tr>
            </tbody>
          </table>
          );
        })}
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Are you currently participating in a senior ROTC scholarship program that pays for your tuition, fees, books and supplies under Section 2107 of Title 10, U.S. Code?</td>
              <td>{this.props.data.seniorRotcScholarshipProgram.value === 'Y' ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

RotcHistoryReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
