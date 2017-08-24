import PropTypes from 'prop-types';
import React from 'react';

import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableDate from '../../../../common/components/form-elements/ErrorableDate';
import { validateIfDirty, isNotBlank } from '../../../../common/utils/validations';
import { isValidRelinquishedDate } from '../../utils/validations';
import { relinquishableBenefits } from '../../utils/options-for-select';
import { showRelinquishedEffectiveDate } from '../../../utils/helpers';

export default class BenefitsRelinquishmentFields extends React.Component {
  render() {
    const dateFields = (
      <div>
        <ErrorableDate required={showRelinquishedEffectiveDate(this.props.data.benefitsRelinquished.value)}
          validation={{
            valid: isValidRelinquishedDate(this.props.data.benefitsRelinquishedDate),
            message: 'Date cannot be earlier than 2 years ago'
          }}
          label="Effective date"
          name="benefitsRelinquishedDate"
          date={this.props.data.benefitsRelinquishedDate}
          onValueChange={(update) => {this.props.onStateChange('benefitsRelinquishedDate', update);}}/>
        <div>
          <ul>
            <li>Use today’s date unless you aren’t going to use your Post 9/11 GI Bill benefits until later.</li>
            <li>If you pick a future date, you can’t get benefits until then.</li>
            <li>If your classes started less than 2 years ago, enter the date they began.</li>
          </ul>
        </div>
      </div>
    );

    // nest DateInputs inside radio buttons
    const options = relinquishableBenefits.map((benefit) => {
      const option = Object.assign({}, benefit);
      if (benefit.value !== 'unknown') {
        if (benefit.additional) {
          option.additional = (
            <div>
              <div className="usa-alert usa-alert-warning usa-content secondary">
                <div className="usa-alert-body">
                  <span>{benefit.additional}</span>
                </div>
              </div>
              {dateFields}
            </div>
          );
        } else {
          option.additional = dateFields;
        }
      }
      return option;
    });

    return (<fieldset>
      <legend>Benefits relinquishment</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <p>Because you chose to apply for your Post-9/11 benefit, you have to relinquish (give up) 1 other benefit you may be eligible for. <br/> <strong>Your decision is irrevocable</strong> (you can’t change your mind).</p>
        <fieldset className="edu-benefits-info-no-icon">
          <ErrorableRadioButtons
            required={this.props.data.chapter33}
            errorMessage={validateIfDirty(this.props.data.benefitsRelinquished, isNotBlank) ? '' : 'Please select a response'}
            label="I choose to give up:"
            name="benefitsRelinquished"
            options={options}
            value={this.props.data.benefitsRelinquished}
            onValueChange={(update) => { this.props.onStateChange('benefitsRelinquished', update); }}/>
        </fieldset>
        <p>If you have questions or don’t understand the choice, talk to a specialist at 1-888-442-4551 (1-888-GI-BILL-1) from 8:00 a.m. - 7:00 p.m. ET Mon - Fri.</p>
      </div>
    </fieldset>
    );
  }
}

BenefitsRelinquishmentFields.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};
