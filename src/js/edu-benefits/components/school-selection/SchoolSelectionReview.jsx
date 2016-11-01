import React from 'react';

import { getLabel, showSchoolAddress, showYesNo } from '../../utils/helpers';
import { schoolTypes } from '../../utils/options-for-select';

export default class SchoolSelectionReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Type of education or training:</td>
            <td>{getLabel(schoolTypes, this.props.data.educationType.value)}</td>
          </tr>
          {showSchoolAddress(this.props.data.educationType.value)
            ? <tbody>
              <tr>
                <td>Name of school:</td>
                <td>{this.props.data.school.name.value}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{this.props.data.school.address.country.value}</td>
              </tr>
              <tr>
                <td>Street:</td>
                <td>{this.props.data.school.address.street.value}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{this.props.data.school.address.city.value}</td>
              </tr>
              <tr>
                <td>State/Province:</td>
                <td>{this.props.data.school.address.state.value}</td>
              </tr>
              <tr>
                <td>Postal code:</td>
                <td>{this.props.data.school.address.postalCode}</td>
              </tr>
            </tbody>
          : null}
          <tr>
            <td>Education or career goal:</td>
            <td>{this.props.data.educationObjective.value}</td>
          </tr>
          <tr>
            <td>The date your training began or will begin:</td>
            <td>{this.props.data.educationStartDate.month.value ? `${this.props.data.educationStartDate.month.value}/${this.props.data.educationStartDate.day.value}/${this.props.data.educationStartDate.year.value}` : null}</td>
          </tr>
          {this.props.data.currentlyActiveDuty.yes.value === 'Y'
            ? <tr>
              <td>Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?</td>
              <td>{showYesNo(this.props.data.currentlyActiveDuty.nonVaAssistance)}</td>
            </tr>
            : null}
        </tbody>
      </table>
    );
  }
}

SchoolSelectionReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
