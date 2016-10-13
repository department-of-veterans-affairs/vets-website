import React from 'react';

export default class PersonalInformationReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{this.props.data.veteranFullName.first.value} {this.props.data.veteranFullName.middle.value} {this.props.data.veteranFullName.last.value} {this.props.data.veteranFullName.suffix.value}</td>
          </tr>
          <tr>
            <td>Social Security number:</td>
            <td>{this.props.data.veteranSocialSecurityNumber.value}</td>
          </tr>
          <tr>
            <td>Date of birth:</td>
            <td>{this.props.data.veteranDateOfBirth.month.value ? `${this.props.data.veteranDateOfBirth.month.value}/${this.props.data.veteranDateOfBirth.day.value}/${this.props.data.veteranDateOfBirth.year.value}` : null}</td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>{this.props.data.gender.value}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

PersonalInformationReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
