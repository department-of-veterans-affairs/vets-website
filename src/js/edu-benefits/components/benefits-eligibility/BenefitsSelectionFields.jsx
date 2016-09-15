import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import RadioButtonsSubSection from '../../../common/components/form-elements/RadioButtonsSubSection';
import { validateIfDirty, isNotBlank } from '../../../common/utils/validations';
import { relinquishableBenefits, yesNo } from '../../utils/options-for-select';

export default class BenefitsSelectionFields extends React.Component {
  render() {
    let relinquishSection;
    if (this.props.data.chapter33) {
      relinquishSection = (<RadioButtonsSubSection showIfValueChosen="chapter33">
        <p className="form-indent">I acknowledge that by choosing Chapter 33 I have to give up some other stuff</p>
        <fieldset className="usa-alert usa-alert-info">
          <ErrorableRadioButtons required={this.props.data.chapter33}
              errorMessage={validateIfDirty(this.props.data.benefitsRelinquished, isNotBlank) ? '' : 'Please select a response'}
              label="I elect to receive Chapter 33 education benefits in lieu of the education benefit(s) I am relinquishing below:"
              name="benefitsRelinquished"
              options={relinquishableBenefits}
              value={this.props.data.benefitsRelinquished}
              onValueChange={(update) => {this.props.onStateChange('benefitsRelinquished', update);}}/>
        </fieldset>
      </RadioButtonsSubSection>);
    }

    return (<fieldset>
      <p>Which education benefit are you applying for?</p>
      <div className="input-section">
        <ErrorableCheckbox
            label="Chapter 33 - Post-9/11 GI Bill"
            name="chapter33"
            checked={this.props.data.chapter33}
            onValueChange={(update) => {this.props.onStateChange('chapter33', update);}}/>
          {relinquishSection}
        <ErrorableCheckbox
            label="Chapter 30 - Montgomery GI Bill Educational Assistance Program"
            name="chapter30"
            checked={this.props.data.chapter30}
            onValueChange={(update) => {this.props.onStateChange('chapter30', update);}}/>
        <ErrorableCheckbox
            label="Chapter 1606 - Montgomery GI Bill - Selected Reserve Educational Assistance Program"
            name="chapter1606"
            checked={this.props.data.chapter1606}
            onValueChange={(update) => {this.props.onStateChange('chapter1606', update);}}/>
        <ErrorableCheckbox
            label="Chapter 32 / Section 903 - Post-Vietnam Era Veterans' Educational Assistance Program"
            name="chapter32"
            checked={this.props.data.chapter32}
            onValueChange={(update) => {this.props.onStateChange('chapter32', update);}}/>
      </div>
      <div className="input-section">
        <ErrorableRadioButtons
            label="Have you filed a previous claim for Education or Vocational Rehabilitation and Employment?"
            name="previouslyFiledClaimWithVa"
            options={yesNo}
            value={this.props.data.previouslyFiledClaimWithVa}
            onValueChange={(update) => {this.props.onStateChange('previouslyFiledClaimWithVa', update);}}/>
      </div>
    </fieldset>
    );
  }
}

BenefitsSelectionFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
