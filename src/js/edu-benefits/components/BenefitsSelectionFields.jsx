import React from 'react';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../common/components/form-elements/ErrorableCheckbox';
import RadioButtonsSubSection from '../../common/components/form-elements/RadioButtonsSubSection';
import { validateIfDirty, isNotBlank } from '../../common/utils/validations';

export default class BenefitsSectionFields extends React.Component {
  render() {
    const options = [
      { label: 'Chapter 33', value: 'chapter33' },
      { label: 'Chapter 30', value: 'chapter30' },
      { label: 'Chapter 1606', value: 'chapter1606' },
      { label: 'Chapter 32 / Section 903', value: 'chapter32' },
      { label: 'I don\'t know', value: 'none' },
    ];
    return (<fieldset>
      <legend>Benefits Information</legend>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <div className="input-section">
        <ErrorableRadioButtons required
            errorMessage={validateIfDirty(this.props.data.benefitsChosen, isNotBlank) ? '' : 'Please select a response'}
            label="Which benefits would you like to use?"
            name="benefitsChosen"
            options={options}
            value={this.props.data.benefitsChosen}
            onValueChange={(update) => {this.props.onStateChange('benefitsChosen', update);}}>
          <RadioButtonsSubSection position={0} showIfValueChosen="chapter33">
            <p className="form-indent">I acknowledge that by choosing Chapter 33 I have to give up some other stuff</p>
            <fieldset className="form-subsection">
              I elect to receive Chapter 33 education benefits in lieu of the education benefit(s) I am relinquishing below
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
                  label="I am not eligible for other benefits"
                  name="notEligible"
                  checked={this.props.data.notEligible}
                  onValueChange={(update) => {this.props.onStateChange('notEligible', update);}}/>
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
