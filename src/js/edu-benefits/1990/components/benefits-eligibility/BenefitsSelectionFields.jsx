import PropTypes from 'prop-types';
import React from 'react';

import ErrorableCheckbox from '../../../../common/components/form-elements/ErrorableCheckbox';
import ErrorableGroup from '../../../../common/components/form-elements/ErrorableGroup';
import ExpandingGroup from '../../../../common/components/form-elements/ExpandingGroup';


export default class BenefitsSelectionFields extends React.Component {
  render() {
    return (<fieldset>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <div className="usa-alert usa-alert-info">
          <div className="usa-alert-body">
            <ul>
              <li>You may be eligible for more than 1 education benefit program.</li>
              <li>You can only get payments from 1 program at a time.</li>
              <li>You can’t get more than 48 months of benefits under any combination of VA education programs.</li>
            </ul>
          </div>
        </div>
        <ErrorableGroup
          required
          label="Select the benefit that is the best match for you."
          validation={this.props.data.chapter33 || this.props.data.chapter30 || this.props.data.chapter1606 || this.props.data.chapter32}
          errorMessage="Please select at least one benefit"
          isDirty={this.props.data.checkedBenefit.dirty}>

          <ExpandingGroup open={this.props.data.chapter33} additionalClass="edu-benefits-selection-group">
            <ErrorableCheckbox
              label={<p>Post-9/11 GI Bill (Chapter 33)<br/><a href="/education/gi-bill/post-9-11/" target="_blank">Learn more</a></p>}
              name="chapter33"
              checked={this.props.data.chapter33}
              onValueChange={(update) => {this.props.onStateChange('chapter33', update);}}/>
            <div className="edu-benefits-chapter33-extra">
              <p>When you choose to apply for your Post-9/11 benefit, you have to relinquish (give up) 1 other benefit you may be eligible for. You’ll make this decision on the next page.</p>
            </div>
          </ExpandingGroup>
          <ErrorableCheckbox
            label={<p>Montgomery GI Bill (MGIB-AD, Chapter 30)<br/><a href="/education/gi-bill/montgomery-active-duty/" target="_blank">Learn more</a></p>}
            name="chapter30"
            checked={this.props.data.chapter30}
            onValueChange={(update) => {this.props.onStateChange('chapter30', update);}}/>
          <ErrorableCheckbox
            label={<p>Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)<br/><a href="/education/gi-bill/montgomery-selected-reserve/" target="_blank">Learn more</a></p>}
            name="chapter1606"
            checked={this.props.data.chapter1606}
            onValueChange={(update) => {this.props.onStateChange('chapter1606', update);}}/>
          <ErrorableCheckbox
            label={<p>Post-Vietnam Era Veterans' Educational Assistance Program<br/>(VEAP, Chapter 32)<br/><a href="/education/other-educational-assistance-programs/veap/" target="_blank">Learn more</a></p>}
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
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};
