import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import DateInput from '../../../common/components/form-elements/DateInput';
import { validateIfDirty, isNotBlank, validateIfDirtyDateObj, isValidFutureDateField } from '../../utils/validations';
import { relinquishableBenefits } from '../../utils/options-for-select';
import { showRelinquishedEffectiveDate } from '../../utils/helpers';

export default class BenefitsSelectionFields extends React.Component {
  render() {
    return (<fieldset>
      <legend>Benefits waiver</legend>
      <div className="input-section">
        <p>You'll need to make two important decisions on this page. If you have questions about this, talk to a specialist at 1-888-GIBILL (1-888-442-4551).</p>
        (Part I)
        <ul className="edu-benefits-list">
          <li>I acknowledge that by choosing to activate my Post-9/11 GI Bill (chapter 33) benefits, I may not receive more than a total of 48 months of benefits under two or more programs.</li>
          <li>I understand that if I enroll in the Post-9/11 GI Bill (and give up my MGIB benefit), VA will limit the number of Post-9/11 GI Bill benefit months to the number of entitlement months remaining under MGIB on the effective date of my election.</li>
          <li>Once I make this choice, I <strong>cannot</strong> change it.</li>
        </ul>
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
                allowFutureDates
                errorMessage="Please provide a date that's the same as or later than today"
                validation={validateIfDirtyDateObj(this.props.data.benefitsRelinquishedDate, isValidFutureDateField)}
                label="Effective date"
                name="benefitsRelinquishedDate"
                day={this.props.data.benefitsRelinquishedDate.day}
                month={this.props.data.benefitsRelinquishedDate.month}
                year={this.props.data.benefitsRelinquishedDate.year}
                onValueChange={(update) => {this.props.onStateChange('benefitsRelinquishedDate', update);}}/>
          : null}
        </fieldset>
      </div>
    </fieldset>
    );
  }
}

BenefitsSelectionFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
