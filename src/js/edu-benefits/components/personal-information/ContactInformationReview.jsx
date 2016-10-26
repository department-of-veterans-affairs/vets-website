import React from 'react';
import { getLabel } from '../../utils/helpers';
import { contactOptions } from '../../utils/options-for-select';

export default class ContactInformationReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Country:</td>
            <td>{this.props.data.veteranAddress.country.value}</td>
          </tr>
          <tr>
            <td>Street:</td>
            <td>{this.props.data.veteranAddress.street.value}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{this.props.data.veteranAddress.city.value}</td>
          </tr>
          <tr>
            <td>State/Province:</td>
            <td>{this.props.data.veteranAddress.state.value}</td>
          </tr>
          <tr>
            <td>Postal code:</td>
            <td>{this.props.data.veteranAddress.postalCode.value}</td>
          </tr>
          <tr>
            <td>Email address:</td>
            <td>{this.props.data.email.value}</td>
          </tr>
          <tr>
            <td>Primary telephone number:</td>
            <td>{this.props.data.homePhone.value}</td>
          </tr>
          <tr>
            <td>Mobile telephone number:</td>
            <td>{this.props.data.mobilePhone.value}</td>
          </tr>
          <tr>
            <td>Preferred contact method:</td>
            <td>{getLabel(contactOptions, this.props.data.preferredContactMethod.value)}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

ContactInformationReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
