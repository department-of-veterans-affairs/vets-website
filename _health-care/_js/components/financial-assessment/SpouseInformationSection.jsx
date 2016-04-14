import React from 'react';
import { connect } from 'react-redux';

import * as calculated from '../../store/calculated';
import Address from '../questions/Address';
import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import FullName from '../questions/FullName';
import Phone from '../questions/Phone';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';
import { updateReviewStatus, veteranUpdateField, updateSpouseAddress } from '../../actions';

// TODO: Consider adding question for marital status here so if user
// entered something incorrect in Personal Information they don't have
// to return to that section to change response

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class SpouseInformationSection extends React.Component {
  render() {
    let notRequiredMessage;
    let noSpouseMessage;
    let content;
    let spouseAddressSummary;
    let spouseAddressFields;
    let editButton;

    if (this.props.receivesVaPension) {
      notRequiredMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
          </strong>
        </p>
      );
    }

    if (!this.props.data.sameAddress) {
      spouseAddressSummary = (
        <div>
          <h4>Spouse's Address and Telephone Number</h4>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Street:</td>
                <td>{this.props.data.spouseAddress.street}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{this.props.data.spouseAddress.city}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{this.props.data.spouseAddress.country}</td>
              </tr>
              <tr>
                <td>State:</td>
                <td>{this.props.data.spouseAddress.state}</td>
              </tr>
              <tr>
                <td>ZIP Code:</td>
                <td>{this.props.data.spouseAddress.zipcode}</td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>{this.props.data.spousePhone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      spouseAddressFields = (
        <div>
          <h4>Spouse's Address and Telephone Number</h4>

          <div className="input-section">
            <Address value={this.props.data.spouseAddress}
                onUserInput={(update) => {this.props.onStateChange('spouseAddress', update);}}/>
            <Phone
                label="Phone"
                value={this.props.data.spousePhone}
                onValueChange={(update) => {this.props.onStateChange('spousePhone', update);}}/>
          </div>
        </div>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Spouse Name:</td>
              <td>{this.props.data.spouseFullName.first} {this.props.data.spouseFullName.middle} {this.props.data.spouseFullName.last} {this.props.data.spouseFullName.suffix}</td>
            </tr>
            <tr>
              <td>Social Security Number:</td>
              <td>{this.props.data.spouseSocialSecurityNumber}</td>
            </tr>
            <tr>
              <td>Date of Birth:</td>
              <td>{this.props.data.spouseDateOfBirth.month}/{this.props.data.spouseDateOfBirth.day}/{this.props.data.spouseDateOfBirth.year}</td>
            </tr>
            <tr>
              <td>Date of Marriage:</td>
              <td>{this.props.data.dateOfMarriage.month}/{this.props.data.dateOfMarriage.day}/{this.props.data.dateOfMarriage.year}</td>
            </tr>
            <tr>
              <td>Do you have the same address as your spouse?:</td>
              <td>{`${this.props.data.sameAddress ? 'Yes' : 'No'}`}</td>
            </tr>
            <tr>
              <td>Did your spouse live with you last year?:</td>
              <td>{`${this.props.data.cohabitedLastYear ? 'Yes' : 'No'}`}</td>
            </tr>
            <tr>
              <td>If your spouse did not live with you last year, did you provide support?:</td>
              <td>{`${this.props.data.provideSupportLastYear ? 'Yes' : 'No'}`}</td>
            </tr>
          </tbody>
        </table>
        {spouseAddressSummary}
      </div>);
    } else {
      content = (<div>
        {notRequiredMessage}
        {noSpouseMessage}
        <div className="input-section">
          <FullName
              value={this.props.data.spouseFullName}
              onUserInput={(update) => {this.props.onStateChange('spouseFullName', update);}}/>

          <SocialSecurityNumber label="Spouse’s Social Security Number"
              required={false}
              ssn={this.props.data.spouseSocialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('spouseSocialSecurityNumber', update);}}/>

          <DateInput label="Spouse’s Date of Birth"
              day={this.props.data.spouseDateOfBirth.day}
              month={this.props.data.spouseDateOfBirth.month}
              year={this.props.data.spouseDateOfBirth.year}
              onValueChange={(update) => {this.props.onStateChange('spouseDateOfBirth', update);}}/>

          <DateInput label="Date of Marriage"
              day={this.props.data.dateOfMarriage.day}
              month={this.props.data.dateOfMarriage.month}
              year={this.props.data.dateOfMarriage.year}
              onValueChange={(update) => {this.props.onStateChange('dateOfMarriage', update);}}/>

          <ErrorableCheckbox
              label="Do you have the same address as your spouse?"
              checked={this.props.data.sameAddress}
              onValueChange={(update) => {this.props.onStateChange('sameAddress', update);}}/>

          <ErrorableCheckbox
              label="Did your spouse live with you last year?"
              checked={this.props.data.cohabitedLastYear}
              onValueChange={(update) => {this.props.onStateChange('cohabitedLastYear', update);}}/>
          <hr/>
          <p>You may count your spouse as your dependent even if you did not live
          together, as long as you contributed support last calendar year.</p>
          <hr/>
          <ErrorableCheckbox
              label="If your spouse did not live with you last year, did you provide support?"
              checked={this.props.data.provideSupportLastYear}
              onValueChange={(update) => {this.props.onStateChange('provideSupportLastYear', update);}}/>
        </div>
        {spouseAddressFields}
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

    if (this.props.receivesVaPension === true) {
      notRequiredMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
          </strong>
        </p>
      );
    }

    if (this.props.neverMarried === true) {
      noSpouseMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you've never had a spouse.
          </strong>
        </p>
      );
    }

    return (
      <div>
        <h4>Spouse's Information</h4>
        {editButton}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran.spouseInformation,
    receivesVaPension: state.veteran.vaInformation.receivesVaPension,
    neverMarried: calculated.neverMarried(state),
    isSectionComplete: state.uiState.completedSections['/financial-assessment/spouse-information']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['spouseInformation', field], update));
      if (field === 'sameAddress') {
        dispatch(updateSpouseAddress(['spouseInformation', 'spouseAddress'], update));
      }
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/financial-assessment/spouse-information'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(SpouseInformationSection);
export { SpouseInformationSection };
