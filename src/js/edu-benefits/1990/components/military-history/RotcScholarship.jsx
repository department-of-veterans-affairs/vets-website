import PropTypes from 'prop-types';
import React from 'react';

import ErrorableTextInput from '../../../../common/components/form-elements/ErrorableTextInput';
import ErrorableNumberInput from '../../../../common/components/form-elements/ErrorableNumberInput';
import { validateIfDirty, isValidYear, isValidValue } from '../../../../common/utils/validations';

import { isValidMonetaryValue } from '../../utils/validations';

export default class RotcScholarship extends React.Component {
  render() {
    const { view, onValueChange } = this.props;
    const scholarship = this.props.data;
    const formFields = (
      <div className="input-section">
        <div className="row">
          <div className="columns small-4 no-pad-left">
            <div className="edu-benefits-first-label">
              <ErrorableNumberInput
                errorMessage={validateIfDirty(scholarship.year, (val) => isValidValue(isValidYear, val)) ? undefined : 'Please enter a valid year.'}
                validation={validateIfDirty(scholarship.year, (val) => isValidValue(isValidYear, val))}
                label="Year"
                name="year"
                field={scholarship.year}
                min="1900"
                onValueChange={(update) => {onValueChange('year', update);}}/>
            </div>
          </div>
          <div className="columns small-8 no-pad-right">
            <div className="edu-benefits-first-label">
              <ErrorableTextInput
                errorMessage={validateIfDirty(scholarship.amount, (val) => isValidValue(isValidMonetaryValue, val)) ? undefined : 'Please enter the amount received.'}
                validation={validateIfDirty(scholarship.amount, (val) => isValidValue(isValidMonetaryValue, val))}
                label="Scholarship amount"
                name="amount"
                field={scholarship.amount}
                placeholder="$"
                onValueChange={(update) => {onValueChange('amount', update);}}/>
            </div>
          </div>
        </div>
      </div>
    );

    let reviewFields;
    if (scholarship.amount.value) {
      reviewFields = (
        <div>
          <div><strong>${scholarship.amount.value}</strong></div>
          <div>{scholarship.year.value}</div>
        </div>
      );
    } else {
      reviewFields = (<div>This entry may be missing information</div>);
    }

    return view === 'collapsed' ? reviewFields : formFields;
  }
}

RotcScholarship.propTypes = {
  data: PropTypes.object.isRequired,
  view: PropTypes.string,
  onValueChange: PropTypes.func.isRequired
};
