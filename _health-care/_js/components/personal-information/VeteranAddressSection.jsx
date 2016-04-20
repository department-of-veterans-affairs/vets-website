import React from 'react';
import { connect } from 'react-redux';

import Address from '../questions/Address';
import Email from '../questions/Email';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import Phone from '../questions/Phone';
import { updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class VeteranAddressSection extends React.Component {
  constructor() {
    super();
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  confirmEmail() {
    if (this.props.data.email.value !== this.props.data.emailConfirmation.value) {
      return 'Please ensure your entries match';
    }

    return undefined;
  }

  render() {
    let content;
    let editButton;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Street:</td>
            <td>{this.props.data.address.street}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{this.props.data.address.city}</td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>{this.props.data.address.country}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{this.props.data.address.state}</td>
          </tr>
          <tr>
            <td>ZIP Code:</td>
            <td>{this.props.data.address.zipcode}</td>
          </tr>
          <tr>
            <td>County:</td>
            <td>{this.props.data.county}</td>
          </tr>
          <tr>
            <td>Email Address:</td>
            <td>{this.props.data.email}</td>
          </tr>
          <tr>
            <td>Re-enter Email address:</td>
            <td>{this.props.data.emailConfirmation}</td>
          </tr>
          <tr>
            <td>Home telephone number:</td>
            <td>{this.props.data.homePhone}</td>
          </tr>
          <tr>
            <td>Mobile telephone number:</td>
            <td>{this.props.data.mobilePhone}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div className="input-section">
        <p>For locations outside the U.S., enter "City,Country" in the City field
            (e.g., "Paris,France"), and select Foreign Country for State.
        </p>

        <Address value={this.props.data.address}
            onUserInput={(update) => {this.props.onStateChange('address', update);}}/>

        <ErrorableTextInput label="County"
            field={this.props.data.county}
            onValueChange={(update) => {this.props.onStateChange('county', update);}}/>

        <Email label="Email address"
            email={this.props.data.email}
            onValueChange={(update) => {this.props.onStateChange('email', update);}}/>

        <Email error={this.confirmEmail()}
            label="Re-enter Email address"
            email={this.props.data.emailConfirmation}
            onValueChange={(update) => {this.props.onStateChange('emailConfirmation', update);}}/>

        <Phone required
            label="Home telephone number"
            value={this.props.data.homePhone}
            onValueChange={(update) => {this.props.onStateChange('homePhone', update);}}/>

        <Phone required
            label="Mobile telephone number"
            value={this.props.data.mobilePhone}
            onValueChange={(update) => {this.props.onStateChange('mobilePhone', update);}}/>
      </div>);
    }

    if (this.props.reviewSection) {
      editButton = (<ErrorableCheckbox
          label={`${this.props.isSectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.isSectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onUIStateChange(update);}}/>
      );
    }

    return (
      <fieldset >
        <div>
          <h4>Permanent Address</h4>
          {editButton}
          {content}
        </div>
      </fieldset>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran.veteranAddress,
    isSectionComplete: state.uiState.completedSections['/personal-information/veteran-address']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['veteranAddress', field], update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/personal-information/veteran-address'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(VeteranAddressSection);
export { VeteranAddressSection };
