import React from 'react';
import { connect } from 'react-redux';

import * as calculated from '../../store/calculated';
import Address from '../questions/Address';
import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import FullName from '../questions/FullName';
import Phone from '../questions/Phone';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';
import { veteranUpdateField } from '../../actions';

// TODO: Consider adding question for marital status here so if user
// entered something incorrect in Personal Information they don't have
// to return to that section to change response

class SpouseInformationSection extends React.Component {
  render() {
    let notRequiredMessage;
    let noSpouseMessage;

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
        <div>
          <h4>Spouse's Information</h4>
          <ErrorableCheckbox
              label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
              checked={this.props.data.sectionComplete}
              className={`edit-checkbox ${this.props.reviewSection ? '' : 'hidden'}`}
              onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>

          {notRequiredMessage}

          {noSpouseMessage}

        </div>
        <div className={`${this.props.data.sectionComplete ? 'review-view' : 'edit-view'}`}>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.spouseInformation,
    receivesVaPension: state.vaInformation.receivesVaPension,
    neverMarried: calculated.neverMarried(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['spouseInformation', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(SpouseInformationSection);
export { SpouseInformationSection };
