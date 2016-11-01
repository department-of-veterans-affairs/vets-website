import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { yesNo } from '../../utils/options-for-select';

export default class DependentInformationFields extends React.Component {
  render() {
    return (<fieldset>
      <legend>Dependents</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <ErrorableRadioButtons
            label="Are you married?"
            name="married"
            options={yesNo}
            value={this.props.data.serviceBefore1977.married}
            onValueChange={(update) => {this.props.onStateChange('serviceBefore1977.married', update);}}/>
        <ErrorableRadioButtons
            label="Do you have any children who are under age 18? Or do you have any children who are over age 18 but under 23, not married, and attending school? Or do you have any children of any age who are permanently disabled for mental or physical reasons?"
            name="haveDependents"
            options={yesNo}
            value={this.props.data.serviceBefore1977.haveDependents}
            onValueChange={(update) => {this.props.onStateChange('serviceBefore1977.haveDependents', update);}}/>
        <ErrorableRadioButtons
            label="Do you have a parent who is dependent upon your financial support?"
            name="parentDependent"
            options={yesNo}
            value={this.props.data.serviceBefore1977.parentDependent}
            onValueChange={(update) => {this.props.onStateChange('serviceBefore1977.parentDependent', update);}}/>
      </div>
    </fieldset>
    );
  }
}

DependentInformationFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
