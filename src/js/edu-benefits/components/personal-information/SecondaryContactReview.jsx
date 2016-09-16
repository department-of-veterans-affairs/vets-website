import React from 'react';

export default class SecondaryContactReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{this.props.data.secondaryContact.fullName.value}</td>
          </tr>
          <tr>
            <td>Telephone number:</td>
            <td>{this.props.data.secondaryContact.phone.value}</td>
          </tr>
          <tr>
            <td>Address for secondary contact is the same as mine:</td>
            <td>{this.props.data.secondaryContact.sameAddress ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
        {this.props.data.secondaryContact.sameAddress
          ? null
          : <tbody><tr>
            <td>Street:</td>
            <td>{this.props.data.secondaryContact.address.street.value}</td>
          </tr>
            <tr>
              <td>City:</td>
              <td>{this.props.data.secondaryContact.address.city.value}</td>
            </tr>
            <tr>
              <td>Country:</td>
              <td>{this.props.data.secondaryContact.address.country.value}</td>
            </tr>
            <tr>
              <td>State/Province:</td>
              <td>{this.props.data.secondaryContact.address.state.value || this.props.data.secondaryContact.address.provinceCode.value}</td>
            </tr>
            <tr>
              <td>ZIP/Postal Code:</td>
              <td>{this.props.data.secondaryContact.address.zipcode.value || this.props.data.secondaryContact.address.postalCode.value}</td>
            </tr></tbody>}
      </table>
    );
  }
}

SecondaryContactReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
