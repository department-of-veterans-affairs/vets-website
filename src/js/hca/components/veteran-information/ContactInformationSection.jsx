import React from 'react';
import { connect } from 'react-redux';

import Email from '../questions/Email';
import Phone from '../questions/Phone';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class ContactInformationSection extends React.Component {
  constructor() {
    super();
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  confirmEmail() {
    if (this.props.data.email.value.toLowerCase() !== this.props.data.emailConfirmation.value.toLowerCase()) {
      return 'Please ensure your entries match';
    }

    return undefined;
  }

  render() {
    let content;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Email Address:</td>
            <td>{this.props.data.email.value}</td>
          </tr>
          <tr>
            <td>Re-enter email address:</td>
            <td>{this.props.data.emailConfirmation.value}</td>
          </tr>
          <tr>
            <td>Home telephone number:</td>
            <td>{this.props.data.homePhone.value}</td>
          </tr>
          <tr>
            <td>Mobile telephone number:</td>
            <td>{this.props.data.mobilePhone.value}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Contact Information</legend>
        <div className="input-section">
          <Email label="Email address"
              email={this.props.data.email}
              additionalClass="first-email"
              onValueChange={(update) => {this.props.onStateChange('email', update);}}/>

          <Email error={this.confirmEmail()}
              label="Re-enter email address"
              email={this.props.data.emailConfirmation}
              additionalClass="second-email"
              onValueChange={(update) => {this.props.onStateChange('emailConfirmation', update);}}/>

          {/* TODO: Change validation to accept phone number without dashes. */}
          <Phone
              label="Home telephone number"
              value={this.props.data.homePhone}
              additionalClass="home-phone"
              onValueChange={(update) => {this.props.onStateChange('homePhone', update);}}/>

          <Phone
              label="Mobile telephone number"
              value={this.props.data.mobilePhone}
              additionalClass="mobile-phone"
              onValueChange={(update) => {this.props.onStateChange('mobilePhone', update);}}/>
        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/veteran-information/contact-information'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ContactInformationSection);
export { ContactInformationSection };
