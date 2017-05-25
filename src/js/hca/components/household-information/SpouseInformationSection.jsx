import React from 'react';
import { connect } from 'react-redux';

import Address from '../Address';
import ErrorableCurrentOrPastDate from '../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import FullName from '../../../common/components/questions/FullName';
import Phone from '../../../common/components/questions/Phone';
import SocialSecurityNumber from '../../../common/components/questions/SocialSecurityNumber';
import { yesNo } from '../../../common/utils/options-for-select.js';
import { validateIfDirty, isNotBlank } from '../../../common/utils/validations';
import { isValidMarriageDate, isValidLastName } from '../../utils/validations';
import { veteranUpdateField, updateSpouseAddress } from '../../actions';

// TODO: Consider adding question for marital status here so if user
// entered something incorrect in Personal Information they don't have
// to return to that section to change response

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class SpouseInformationSection extends React.Component {
  render() {
    let content;
    let spouseInformationSummary;
    let spouseInformationFields;
    let spouseAddressSummary;
    let spouseAddressFields;
    let livedWithSpouseSummary;
    let livedWithSpouseFields;

    if (this.props.data.cohabitedLastYear.value === 'N') {
      livedWithSpouseSummary = (
        <tr>
          <td>If your spouse did not live with you last year, did you provide support?:</td>
          <td>{`${this.props.data.provideSupportLastYear.value === 'Y' ? 'Yes' : 'No'}`}</td>
        </tr>
      );
      livedWithSpouseFields = (
        <ErrorableRadioButtons
            label="If your spouse did not live with you last year, did you provide financial support?"
            name="provideSupportLastYear"
            options={yesNo}
            value={this.props.data.provideSupportLastYear}
            onValueChange={(update) => {this.props.onStateChange('provideSupportLastYear', update);}}/>
      );
    }

    if (this.props.data.maritalStatus.value === 'Married' || this.props.data.maritalStatus.value === 'Separated') {
      spouseInformationSummary = (
        <tbody>
          <tr>
            <td>Spouse Name:</td>
            <td>{this.props.data.spouseFullName.first.value} {this.props.data.spouseFullName.middle.value} {this.props.data.spouseFullName.last.value} {this.props.data.spouseFullName.suffix.value}</td>
          </tr>
          <tr>
            <td>Social security sumber:</td>
            <td>{this.props.data.spouseSocialSecurityNumber.value}</td>
          </tr>
          <tr>
            <td>Date of birth:</td>
            <td>{this.props.data.spouseDateOfBirth.month.value}/{this.props.data.spouseDateOfBirth.day.value}/{this.props.data.spouseDateOfBirth.year.value}</td>
          </tr>
          <tr>
            <td>Date of marriage:</td>
            <td>{this.props.data.dateOfMarriage.month.value}/{this.props.data.dateOfMarriage.day.value}/{this.props.data.dateOfMarriage.year.value}</td>
          </tr>
          <tr>
            <td>Do you have the same address as your spouse?:</td>
            <td>{`${this.props.data.sameAddress.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Did your spouse live with you last year?:</td>
            <td>{`${this.props.data.cohabitedLastYear.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
          {livedWithSpouseSummary}
        </tbody>
      );

      spouseInformationFields = (
        <div className="input-section">
          <FullName required
              name={this.props.data.spouseFullName}
              customValidation={isValidLastName}
              customErrorMessage="Please enter a valid name. Must be at least 2 characters."
              onUserInput={(update) => {this.props.onStateChange('spouseFullName', update);}}/>

          <SocialSecurityNumber required
              label="Spouse’s social security number"
              ssn={this.props.data.spouseSocialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('spouseSocialSecurityNumber', update);}}/>

          <ErrorableCurrentOrPastDate required
              label="Spouse’s date of birth"
              name="spouseBirth"
              date={this.props.data.spouseDateOfBirth}
              onValueChange={(update) => {this.props.onStateChange('spouseDateOfBirth', update);}}/>

          <ErrorableCurrentOrPastDate required
              validation={{
                valid: isValidMarriageDate(this.props.data.dateOfMarriage, this.props.data.veteranDateOfBirth, this.props.data.spouseDateOfBirth),
                message: "Date of marriage cannot be before the Veteran's or the spouse's date of birth"
              }}
              label="Date of marriage"
              name="marriage"
              date={this.props.data.dateOfMarriage}
              onValueChange={(update) => {this.props.onStateChange('dateOfMarriage', update);}}/>

          <ErrorableRadioButtons required
              errorMessage={validateIfDirty(this.props.data.sameAddress, isNotBlank) ? '' : 'Please select a response'}
              label="Do you have the same address as your spouse?"
              name="sameAddress"
              options={yesNo}
              value={this.props.data.sameAddress}
              onValueChange={(update) => {this.props.onStateChange('sameAddress', update);}}/>

          <ErrorableRadioButtons
              label="Did your spouse live with you last year?"
              name="cohabitedLastYear"
              options={yesNo}
              value={this.props.data.cohabitedLastYear}
              onValueChange={(update) => {this.props.onStateChange('cohabitedLastYear', update);}}/>
          {livedWithSpouseFields}
        </div>
      );
    }

    if (this.props.data.sameAddress.value === 'N' &&
        (this.props.data.maritalStatus.value === 'Married' || this.props.data.maritalStatus.value === 'Separated')
    ) {
      spouseAddressSummary = (
        <div>
          <h4>Spouse's Address and Telephone Number</h4>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Street:</td>
                <td>{this.props.data.spouseAddress.street.value}</td>
              </tr>
              <tr>
                <td>Line 2:</td>
                <td>{this.props.data.spouseAddress.street2.value}</td>
              </tr>
              <tr>
                <td>Line 3:</td>
                <td>{this.props.data.spouseAddress.street3.value}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{this.props.data.spouseAddress.city.value}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{this.props.data.spouseAddress.country.value}</td>
              </tr>
              <tr>
                <td>State/Province:</td>
                <td>{this.props.data.spouseAddress.state.value || this.props.data.spouseAddress.provinceCode.value}</td>
              </tr>
              <tr>
                <td>ZIP/Postal Code:</td>
                <td>{this.props.data.spouseAddress.zipcode.value || this.props.data.spouseAddress.postalCode.value}</td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>{this.props.data.spousePhone.value}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      spouseAddressFields = (
        <div>
          <h4>Spouse's Address and Telephone Number</h4>
          <div className="input-section">
            <Address required
                value={this.props.data.spouseAddress}
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
          {spouseInformationSummary}
        </table>
        {spouseAddressSummary}
      </div>);
    } else {
      content = (<fieldset>
        <h5>Spouse's Information</h5>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <p>Please fill this out to the best of your knowledge. The more accurate your responses, the faster we can process your application.</p>
        <div className="input-section">
          {spouseInformationFields}
          {spouseAddressFields}
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
    isSectionComplete: state.uiState.sections['/household-information/spouse-information'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
      if (field === 'sameAddress') {
        dispatch(updateSpouseAddress('spouseAddress', update));
      }
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(SpouseInformationSection);
export { SpouseInformationSection };
