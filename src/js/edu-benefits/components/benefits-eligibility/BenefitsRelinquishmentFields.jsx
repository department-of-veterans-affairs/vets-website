import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';
import DateInput from '../../../common/components/form-elements/DateInput';
import { validateIfDirty, isNotBlank, validateIfDirtyDateObj, isValidRelinquishedDate } from '../../utils/validations';
import { relinquishableBenefits } from '../../utils/options-for-select';
import { showRelinquishedEffectiveDate } from '../../utils/helpers';

export default class BenefitsRelinquishmentFields extends React.Component {
  render() {
    return (<fieldset>
      <legend>Benefits relinquishment</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <p>If you are eligible for both the Post 9/11 GI Bill and another program, such as the Montgomery GI Bill – Active Duty (MGIB-AD), you have to choose which one you want to use. Once you <strong>apply</strong> for one or the other, <strong>your decision is irrevocable</strong> (meaning you can't change your mind).</p>
        <fieldset className="edu-benefits-info-no-icon">
          <ExpandingGroup
              additionalClass="edu-benefits-active-group"
              open={showRelinquishedEffectiveDate(this.props.data.benefitsRelinquished.value)}>
            <div>
              <ErrorableRadioButtons required={this.props.data.chapter33}
                  errorMessage={validateIfDirty(this.props.data.benefitsRelinquished, isNotBlank) ? '' : 'Please select a response'}
                  label="I choose to give up:"
                  name="benefitsRelinquished"
                  options={relinquishableBenefits}
                  value={this.props.data.benefitsRelinquished}
                  onValueChange={(update) => {this.props.onStateChange('benefitsRelinquished', update);}}/>
            </div>
            <div>
              <DateInput required={showRelinquishedEffectiveDate(this.props.data.benefitsRelinquished.value)}
                  allowFutureDates
                  errorMessage="Date cannot be earlier than 2 years ago"
                  validation={validateIfDirtyDateObj(this.props.data.benefitsRelinquishedDate, isValidRelinquishedDate)}
                  label="Effective date"
                  name="benefitsRelinquishedDate"
                  day={this.props.data.benefitsRelinquishedDate.day}
                  month={this.props.data.benefitsRelinquishedDate.month}
                  year={this.props.data.benefitsRelinquishedDate.year}
                  onValueChange={(update) => {this.props.onStateChange('benefitsRelinquishedDate', update);}}/>
              <div>
                <ul>
                  <li>Use today's date unless you aren't going to use your Post 9/11 GI Bill benefits until later.</li>
                  <li>If you pick a future date, you can't get benefits until then.</li>
                  <li>If your classes started less than 2 years ago, enter the date they began.</li>
                </ul>
              </div>
            </div>
          </ExpandingGroup>
        </fieldset>
        <p>If you have questions or don’t understand the choice, talk to a specialist at 1-888-442-4551 (888-GI-BILL-1).</p>
      </div>
    </fieldset>
    );
  }
}

BenefitsRelinquishmentFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
