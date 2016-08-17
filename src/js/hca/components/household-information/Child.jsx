import React from 'react';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import DateInput from '../form-elements/DateInput';
import FullName from '../questions/FullName';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';

import { childRelationships, yesNo } from '../../utils/options-for-select.js';
import { isNotBlank, isValidField, isValidMonetaryValue, validateIfDirty, isValidDependentDateField } from '../../utils/validations';

// TODO: create unique nodes for each child in applicationData

class Child extends React.Component {
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';
    let content;
    let livedWithChildField;

    if (this.props.data.childCohabitedLastYear.value === 'N') {
      livedWithChildField = (
        <div className="row">
          <div className="small-12 columns">
            <ErrorableRadioButtons
                label="If your dependent child did not live with you last year, did you provide support?"
                name="childReceivedSupportLastYear"
                options={yesNo}
                value={this.props.data.childReceivedSupportLastYear}
                onValueChange={(update) => {this.props.onValueChange('childReceivedSupportLastYear', update);}}/>
          </div>
        </div>
      );
    }

    // TODO: to look into why children data isn't getting updated in the store as it's being entered
    if (this.props.view === 'collapsed') {
      content = `${this.props.data.childFullName.first.value} ${this.props.data.childFullName.last.value}`;
    } else {
      content = (
        <fieldset>
          <legend>Child's Name</legend>
          <div className="row">
            <div className="small-12 columns">
              <FullName required
                  name={this.props.data.childFullName}
                  onUserInput={(update) => {this.props.onValueChange('childFullName', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <ErrorableSelect required
                  errorMessage={validateIfDirty(this.props.data.childRelation, isNotBlank) ? undefined : 'Please select an option'}
                  label="Child’s relationship to you"
                  name="childRelation"
                  options={childRelationships}
                  value={this.props.data.childRelation}
                  onValueChange={(update) => {this.props.onValueChange('childRelation', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <SocialSecurityNumber label="Child’s social security number"
                  required
                  ssn={this.props.data.childSocialSecurityNumber}
                  onValueChange={(update) => {this.props.onValueChange('childSocialSecurityNumber', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <DateInput required
                  label="Child’s date of birth"
                  name="childBirth"
                  day={this.props.data.childDateOfBirth.day}
                  month={this.props.data.childDateOfBirth.month}
                  year={this.props.data.childDateOfBirth.year}
                  onValueChange={(update) => {this.props.onValueChange('childDateOfBirth', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <DateInput required
                  errorMessage="Child cannot be a dependent before child's date of birth"
                  validation={isValidDependentDateField(this.props.data.childBecameDependent, this.props.data.childDateOfBirth)}
                  label="Date child became dependent"
                  name="childBecameDependent"
                  day={this.props.data.childBecameDependent.day}
                  month={this.props.data.childBecameDependent.month}
                  year={this.props.data.childBecameDependent.year}
                  onValueChange={(update) => {this.props.onValueChange('childBecameDependent', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <ErrorableRadioButtons
                  label="Was child permanently and totally disabled before the age of 18?"
                  name="childDisabledBefore18"
                  options={yesNo}
                  value={this.props.data.childDisabledBefore18}
                  onValueChange={(update) => {this.props.onValueChange('childDisabledBefore18', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <ErrorableRadioButtons
                  label="If child is between 18 and 23 years of age, did child attend school during the last calendar year?"
                  name="childAttendedSchoolLastYear"
                  options={yesNo}
                  value={this.props.data.childAttendedSchoolLastYear}
                  onValueChange={(update) => {this.props.onValueChange('childAttendedSchoolLastYear', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <ErrorableTextInput
                  errorMessage={isValidField(isValidMonetaryValue, this.props.data.childEducationExpenses) ? undefined : message}
                  label="Expenses paid by your dependent child for college, vocational rehabilitation, or training (e.g., tuition, books, materials)?"
                  name="childEducationExpenses"
                  field={this.props.data.childEducationExpenses}
                  onValueChange={(update) => {this.props.onValueChange('childEducationExpenses', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <ErrorableRadioButtons
                  label="Did your child live with you last year?"
                  name="childCohabitedLastYear"
                  options={yesNo}
                  value={this.props.data.childCohabitedLastYear}
                  onValueChange={(update) => {this.props.onValueChange('childCohabitedLastYear', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <p>Count child support contributions even if not paid in regular set amounts. Contributions
              can include tuition payments or payments of medical bills.</p>
            </div>
          </div>
          {livedWithChildField}
        </fieldset>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

Child.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};

export default Child;
