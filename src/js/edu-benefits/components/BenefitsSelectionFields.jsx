import React from 'react';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';
import RadioButtonsSubSection from '../../common/components/form-elements/RadioButtonsSubSection';
import { validateIfDirty, isNotBlank } from '../../common/utils/validations';

export default class BenefitsSectionFields extends React.Component {
  render() {
    const options = [
      { label: 'Chapter 33 - Post-9/11 GI Bill', value: 'chapter33' },
      { label: 'Chapter 30 - Montgomery GI Bill Educational Assistance Program', value: 'chapter30' },
      { label: 'Chapter 1606 - Montgomery GI Bill - Selected Reserve Educational Assistance Program', value: 'chapter1606' },
      { label: 'Chapter 32 / Section 903 - Post-Vietnam Era Veterans\' Educational Assistance Program', value: 'chapter32' }
    ];
    return (<fieldset>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <div className="input-section">
        <ErrorableRadioButtons required
            errorMessage={validateIfDirty(this.props.data.benefitsChosen, isNotBlank) ? '' : 'Please select a response'}
            label="Which education benefits are you applying for?"
            name="benefitsChosen"
            options={options}
            value={this.props.data.benefitsChosen}
            onValueChange={(update) => {this.props.onStateChange('benefitsChosen', update);}}>
          <RadioButtonsSubSection showIfValueChosen="chapter33">
            <p className="form-indent">I acknowledge that by choosing Chapter 33 I have to give up some other stuff</p>
            <fieldset className="form-subsection">
              I elect to receive Chapter 33 education benefits in lieu of the education benefit(s) I am relinquishing below:
              <ErrorableCheckbox
                  label="Chapter 30"
                  name="chapter30Relinquished"
                  checked={this.props.data.chapter30Relinquished}
                  onValueChange={(update) => {this.props.onStateChange('chapter30Relinquished', update);}}/>
              <ErrorableCheckbox
                  label="Chapter 1606"
                  name="chapter1606Relinquished"
                  checked={this.props.data.chapter1606Relinquished}
                  onValueChange={(update) => {this.props.onStateChange('chapter1606Relinquished', update);}}/>
              <ErrorableCheckbox
                  label="Chapter 1607"
                  name="chapter1607Relinquished"
                  checked={this.props.data.chapter1607Relinquished}
                  onValueChange={(update) => {this.props.onStateChange('chapter1607Relinquished', update);}}/>
              <ErrorableCheckbox
                  label="I don't have anything to relinquish"
                  name="nothingToRelinquish"
                  checked={this.props.data.nothingToRelinquish}
                  onValueChange={(update) => {this.props.onStateChange('nothingToRelinquish', update);}}/>
            </fieldset>
          </RadioButtonsSubSection>
        </ErrorableRadioButtons>
      </div>
    </fieldset>
    );
  }
}

BenefitsSectionFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
