import React from 'react';

import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import ErrorableGroup from '../../../common/components/form-elements/ErrorableGroup';

export default class BenefitsSelectionFields extends React.Component {
  render() {
    return (<fieldset>
      <legend className="hide-for-small-only">Benefits eligibility</legend>
      <div className="input-section">
        <ErrorableGroup
            required
            label="Select the benefit that is the best match for you."
            validation={this.props.data.chapter33 || this.props.data.chapter30 || this.props.data.chapter1606 || this.props.data.chapter32}
            errorMessage="Please select at least one benefit"
            isDirty={this.props.data.checkedBenefit.dirty}>
          <div className="usa-alert usa-alert-info">
            <div className="usa-alert-body">
              <ul>
                <li>You may be eligible for more than 1 education benefit program.</li>
                <li>You can only get payments from 1 program at a time.</li>
                <li>You can’t get more than 48 months of benefits under any combination of VA education programs.</li>
              </ul>
            </div>
          </div>

          <ErrorableCheckbox
              label="Post-9/11 GI Bill (Chapter 33)"
              name="chapter33"
              checked={this.props.data.chapter33}
              onValueChange={(update) => {this.props.onStateChange('chapter33', update);}}/>
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
        </ErrorableGroup>
      </div>
    </fieldset>
    );
  }
}

BenefitsSelectionFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
