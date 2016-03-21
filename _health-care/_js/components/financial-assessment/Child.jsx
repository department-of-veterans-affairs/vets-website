import React from 'react';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import DateInput from '../form-elements/DateInput';
import FullName from '../questions/FullName';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';

import { childRelationships } from '../../utils/options-for-select.js';
import { isBlank, isNotBlank, isValidMonetaryValue } from '../../utils/validations';

// TODO: create unique nodes for each child in applicationData

class Child extends React.Component {
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <p>Child's Name</p>
            <FullName required
                value={this.props.data.childFullName}
                onUserInput={(update) => {this.props.onValueChange('childFullName', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableSelect required
                errorMessage={isNotBlank(this.props.data.childRelation) ? undefined : 'Please select an option'}
                label="Child’s relationship to you"
                options={childRelationships}
                value={this.props.data.childRelation}
                onValueChange={(update) => {this.props.onValueChange('childRelation', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <SocialSecurityNumber label="Child’s Social Security Number"
                required
                ssn={this.props.data.childSocialSecurityNumber}
                onValueChange={(update) => {this.props.onValueChange('childSocialSecurityNumber', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h5>Date Child Became Dependent</h5>
            <DateInput required
                day={this.props.data.childBecameDependent.day}
                month={this.props.data.childBecameDependent.month}
                year={this.props.data.childBecameDependent.year}
                onValueChange={(update) => {this.props.onValueChange('childBecameDependent', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h5>Child’s Date of Birth</h5>
            <DateInput required
                day={this.props.data.childDateOfBirth.day}
                month={this.props.data.childDateOfBirth.month}
                year={this.props.data.childDateOfBirth.year}
                onValueChange={(update) => {this.props.onValueChange('childDateOfBirth', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Was child permanently and totally disabled before the age of 18?"
                checked={this.props.data.childDisabledBefore18}
                onValueChange={(update) => {this.props.onValueChange('childDisabledBefore18', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="If child is between 18 and 23 years of age, did child attend school last calendar year?"
                checked={this.props.data.childAttendedSchoolLastYear}
                onValueChange={(update) => {this.props.onValueChange('childAttendedSchoolLastYear', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableTextInput
                errorMessage={isBlank(this.props.data.childEducationExpenses) || isValidMonetaryValue(this.props.data.childEducationExpenses) ? undefined : message}
                label="Expenses paid by your dependent child for college, vocational rehabilitation or training
                    (e.g., tuition, books, materials)?"
                value={this.props.data.childEducationExpenses}
                onValueChange={(update) => {this.props.onValueChange('childEducationExpenses', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Did your child live with you last year?"
                checked={this.props.data.childCohabitedLastYear}
                onValueChange={(update) => {this.props.onValueChange('childCohabitedLastYear', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <p>Count child support contributions even if not paid in regular set amounts. Contributions
            can include tuition payments or payments of medical bills.</p>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="If your dependent child did not live with you last year, did you provide support?"
                checked={this.props.data.childReceivedSupportLastYear}
                onValueChange={(update) => {this.props.onValueChange('childReceivedSupportLastYear', update);}}/>
          </div>
        </div>
      </div>
    );
  }
}

Child.propTypes = {
  data: React.PropTypes.object.isRequired,
  onValueChange: React.PropTypes.func.isRequired
};

export default Child;
