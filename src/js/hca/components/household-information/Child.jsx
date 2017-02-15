import React from 'react';

import ErrorableDate from '../../../common/components/form-elements/ErrorableDate';
import ErrorableCurrentOrPastDate from '../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import FullName from '../../../common/components/questions/FullName';
import SocialSecurityNumber from '../../../common/components/questions/SocialSecurityNumber';

import { childRelationships, yesNo } from '../../../common/utils/options-for-select.js';
import { validateIfDirty, isNotBlank } from '../../../common/utils/validations';
import { isValidDependentDateField, isValidLastName } from '../../utils/validations';
import { getMonetaryErrorMessage } from '../../utils/messages';

// TODO: create unique nodes for each child in applicationData

class Child extends React.Component {
  render() {
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
                  customValidation={isValidLastName}
                  customErrorMessage="Please enter a valid name. Must be at least 2 characters."
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
              <ErrorableCurrentOrPastDate required
                  label="Child’s date of birth"
                  name="childBirth"
                  date={this.props.data.childDateOfBirth}
                  onValueChange={(update) => {this.props.onValueChange('childDateOfBirth', update);}}/>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <ErrorableDate required
	          validation={{
		    valid: isValidDependentDateField(this.props.data.childBecameDependent, this.props.data.childDateOfBirth),
		    message: "Child cannot be a dependent before child's date of birth"
		  }}
                  label="Date child became dependent"
                  name="childBecameDependent"
                  date={this.props.data.childBecameDependent}
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
              <ErrorableTextInput required
                  errorMessage={getMonetaryErrorMessage(this.props.data.childEducationExpenses)}
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
