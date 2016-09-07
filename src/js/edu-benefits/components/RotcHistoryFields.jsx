import React from 'react';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import ProgressButton from '../../common/components/form-elements/ProgressButton';

export default class RotcHistoryFields extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
  }
  addNew() {
    // TODO: block this out
  }
  render() {
    return (<fieldset>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <p>ROTC placeholder</p>
      <div className="input-section">
        <p>Scholarship details</p>
        <ErrorableTextInput
            label="Amount recieved"
            name="RotcAmount"
            field={{ value: '', dirty: false }}
            placeholder="$"
            onValueChange={(update) => {this.props.onStateChange('RotcAmount', update);}}/>
        <ErrorableTextInput
            label="Year recieved"
            name="RotcYear"
            field={{ value: '', dirty: false }}
            placeholder="YYYY"
            onValueChange={(update) => {this.props.onStateChange('RotcYear', update);}}/>
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            <ProgressButton
                onButtonClick={this.addNew}
                buttonText="Add"
                buttonClass="usa-button-primary"
                beforeText=""/>
          </div>
        </div>
        <ErrorableRadioButtons
            label="Are you currently participating in a senior ROTC scholarship program that pays for your tuition, fees, books and supplies under Section 2107 of Title 10, U.S. Code?"
            options={['Yes', 'No']}
            value={{ value: 'Yes', dirty: false }}
            name="RotcTuition"
            onValueChange={(update) => {this.props.onStateChange('RotcAmount', update);}}/>
      </div>
    </fieldset>
    );
  }
}

RotcHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
