import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import RadioButtonsSubSection from '../../../common/components/form-elements/RadioButtonsSubSection';
import DateInput from '../../../common/components/form-elements/DateInput';
import { validateIfDirty, isNotBlank, validateIfDirtyDateObj, isValidDateField } from '../../utils/validations';
import { relinquishableBenefits, yesNo, ownBenefitsOptions } from '../../utils/options-for-select';
import { showRelinquishedEffectiveDate } from '../../utils/helpers';

export default class BenefitsSelectionFields extends React.Component {
  render() {
    let relinquishSection;
    if (this.props.data.chapter33) {
      relinquishSection = (<RadioButtonsSubSection showIfValueChosen="chapter33">
        <div className="form-indent">
          <p>You'll need to make two important decisions on this page. If you have questions about this, talk to a specialist at 1-888-GIBILL (1-888-442-4551).</p>
          (Part I)
          <ul className="edu-benefits-list">
            <li>I acknowledge that by choosing to activate my Post-9/11 GI Bill (chapter 33) benefits, I may not receive more than a total of 48 months of benefits under two or more programs.</li>
            <li>I understand that if I enroll in the Post-9/11 GI Bill (and give up my MGIB benefit), VA will limit the number of Post-9/11 GI Bill benefit months to the number of entitlement months remaining under MGIB on the effective date of my election.</li>
            <li>Once I make this choice, I <strong>cannot</strong> change it.</li>
          </ul>
        </div>
        <fieldset className="usa-alert usa-alert-info edu-benefits-info-no-icon">
          <div>
            (Part II) I acknowledge that by choosing to activate my Post-9/11 GI Bill benefits, I have to give up one of the other educational programs for which I’m also eligible. Once I do this, I can’t change it.
            <ErrorableRadioButtons required={this.props.data.chapter33}
                errorMessage={validateIfDirty(this.props.data.benefitsRelinquished, isNotBlank) ? '' : 'Please select a response'}
                label="I choose to give up:"
                name="benefitsRelinquished"
                options={relinquishableBenefits}
                value={this.props.data.benefitsRelinquished}
                onValueChange={(update) => {this.props.onStateChange('benefitsRelinquished', update);}}/>
          </div>
          {showRelinquishedEffectiveDate(this.props.data.benefitsRelinquished.value)
            ? <DateInput required={showRelinquishedEffectiveDate(this.props.data.benefitsRelinquished.value)}
                errorMessage="Please provide a response"
                validation={validateIfDirtyDateObj(this.props.data.benefitsRelinquishedDate, isValidDateField)}
                label="Effective date"
                name="benefitsRelinquishedDate"
                day={this.props.data.benefitsRelinquishedDate.day}
                month={this.props.data.benefitsRelinquishedDate.month}
                year={this.props.data.benefitsRelinquishedDate.year}
                onValueChange={(update) => {this.props.onStateChange('benefitsRelinquishedDate', update);}}/>
          : null}
        </fieldset>
      </RadioButtonsSubSection>);
    }

    return (<fieldset>
      <legend className="hide-for-small-only">Benefits eligibility</legend>
      <div className="input-section" style={{ display: 'none' }}>
        <ErrorableRadioButtons
            label="Are you applying using your own benefits or those of a spouse or parent?"
            name="applyingUsingOwnBenefits"
            options={ownBenefitsOptions}
            value={this.props.data.applyingUsingOwnBenefits}
            onValueChange={(update) => {this.props.onStateChange('applyingUsingOwnBenefits', update);}}/>
      </div>
      <p>Choose an education benefit:</p>
      <div className="input-section">
        <ErrorableCheckbox
            label="Post-9/11 GI Bill (Chapter 33)"
            name="chapter33"
            checked={this.props.data.chapter33}
            onValueChange={(update) => {this.props.onStateChange('chapter33', update);}}/>
          {relinquishSection}
        <ErrorableCheckbox
            label="Montgomery GI Bill Active Duty (MGIB or Chapter 30) Education Assistance Program"
            name="chapter30"
            checked={this.props.data.chapter30}
            onValueChange={(update) => {this.props.onStateChange('chapter30', update);}}/>
        <ErrorableCheckbox
            label="Montgomery GI Bill Selected Reserve (MGIB-SR or Chapter 1606) Educational Assistance Program"
            name="chapter1606"
            checked={this.props.data.chapter1606}
            onValueChange={(update) => {this.props.onStateChange('chapter1606', update);}}/>
        <ErrorableCheckbox
            label="Post-Vietnam Era Veterans' Educational Assistance Program (VEAP or chapter 32)"
            name="chapter32"
            checked={this.props.data.chapter32}
            onValueChange={(update) => {this.props.onStateChange('chapter32', update);}}/>
      </div>
      <div className="input-section">
        <ErrorableRadioButtons
            label="Have you ever filed a claim with VA for VR&E or education benefits?"
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
