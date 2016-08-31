import React from 'react';

export default class BenefitsSectionFields extends React.Component {
  render() {
    return (<fieldset>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <p>ROTC placeholder</p>
      <div className="input-section">
      </div>
    </fieldset>
    );
  }
}

BenefitsSectionFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
