import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';
import DateInput from '../../../common/components/form-elements/DateInput';
import { validateIfDirty, isNotBlank, validateIfDirtyDateObj, isValidFutureDateField } from '../../utils/validations';
import { relinquishableBenefits } from '../../utils/options-for-select';
import { showRelinquishedEffectiveDate } from '../../utils/helpers';

export default class BenefitsSelectionFields extends React.Component {
  render() {
    return (<fieldset>
      <legend>Benefits waiver</legend>
      <div className="input-section">
        <p>If you are eligible for both the Post 9/11 GI Bill and another program, such as the Montgomery GI Bill – Active Duty (MGIB-AD), you have to choose which one you want to use. <b>Once you apply for one or the other, you can’t change it.</b></p>
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
                  errorMessage="Please provide a date that's the same as or later than today"
                  validation={validateIfDirtyDateObj(this.props.data.benefitsRelinquishedDate, isValidFutureDateField)}
                  label="Effective date"
                  name="benefitsRelinquishedDate"
                  day={this.props.data.benefitsRelinquishedDate.day}
                  month={this.props.data.benefitsRelinquishedDate.month}
                  year={this.props.data.benefitsRelinquishedDate.year}
                  onValueChange={(update) => {this.props.onStateChange('benefitsRelinquishedDate', update);}}/>
                Use today’s date unless you aren't going to use your Post 9/11 GI Bill benefits (Chapter 33) until later. If you do pick a future date, you can't get benefits until then.
            </div>
          </ExpandingGroup>
        </fieldset>
        <p>If you have questions or don’t understand the choice, talk to a specialist at 1-888-442-4551.</p>
      </div>
    </fieldset>
    );
  }
}

BenefitsSelectionFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
