import PropTypes from 'prop-types';
import React from 'react';

import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableNumberInput from '../../../../common/components/form-elements/ErrorableNumberInput';
import ExpandingGroup from '../../../../common/components/form-elements/ExpandingGroup';
import { validateIfDirty, isValidCurrentOrPastYear, isValidField } from '../../../../common/utils/validations';

import { yesNo } from '../../utils/options-for-select';

export default class MilitaryServiceFields extends React.Component {
  render() {
    const activeDutyQuestions = (
      <div>
        <ErrorableRadioButtons
          label="Are you on terminal leave now?"
          name="onTerminalLeave"
          options={yesNo}
          value={this.props.data.currentlyActiveDuty.onTerminalLeave}
          onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.onTerminalLeave', update);}}/>
      </div>
    );

    return (<fieldset>
      <legend>Military service</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <ErrorableNumberInput
          additionalClass="usa-input-medium"
          errorMessage={validateIfDirty(this.props.data.serviceAcademyGraduationYear, (value) => isValidField(isValidCurrentOrPastYear, { value })) ? undefined : 'Please enter a valid year (cannot be future year)'}
          label="If you received a commission from a military service academy, what year did you graduate?"
          name="serviceAcademyGraduationYear"
          min="1900"
          field={this.props.data.serviceAcademyGraduationYear}
          onValueChange={(update) => {this.props.onStateChange('serviceAcademyGraduationYear', update);}}/>
        <ExpandingGroup open={this.props.data.currentlyActiveDuty.yes.value === 'Y'} additionalClass="edu-benefits-mil-group">
          <ErrorableRadioButtons
            label="Are you on active duty now?"
            name="currentlyActiveDuty"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.yes}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.yes', update);}}/>
          {activeDutyQuestions}
        </ExpandingGroup>
      </div>
    </fieldset>
    );
  }
}

MilitaryServiceFields.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initializeFields: PropTypes.func.isRequired
};
