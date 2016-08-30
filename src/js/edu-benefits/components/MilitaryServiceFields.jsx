import React from 'react';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';

import { validateIfDirty, isNotBlank } from '../../common/utils/validations';
import { yesNo } from '../utils/options-for-select';

export default class MilitaryServiceFields extends React.Component {
  render() {
    const activeDutyQuestions = (
      <div>
        <ErrorableRadioButtons
            errorMessage={validateIfDirty(this.props.data.currentlyActiveDuty.onTerminalLeave, isNotBlank) ? '' : 'Please select a response'}
            label="Are you on terminal leave?"
            name="onTerminalLeave"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.onTerminalLeave}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.onTerminalLeave', update);}}/>
        <ErrorableRadioButtons
            errorMessage={validateIfDirty(this.props.data.currentlyActiveDuty.nonVaAssistance, isNotBlank) ? '' : 'Please select a response'}
            label="Are you receiving, or do you anticipate receiving, any money (including but not limited to federal tuition assistance) from the armed forces or public health services for the course for which you have applied to the VA for education benefits?"
            name="nonVaAssistance"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.nonVaAssistance}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.nonVaAssistance', update);}}/>
      </div>
    );

    return (<fieldset>
      <legend>Military Service</legend>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <p>Which education benefit are you applying for?</p>
      <div className="input-section">
        <ErrorableRadioButtons
            errorMessage={validateIfDirty(this.props.data.currentlyActiveDuty.yes, isNotBlank) ? '' : 'Please select a response'}
            label="Are you on active duty?"
            name="currentlyActiveDuty"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.yes}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.yes', update);}}/>
          {this.props.data.currentlyActiveDuty.yes.value === 'Y' ? activeDutyQuestions : null}
      </div>
    </fieldset>
    );
  }
}

MilitaryServiceFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
