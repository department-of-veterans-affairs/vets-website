import React from 'react';

export default class BenefitsInformation extends React.Component {
  render() {
    return (<fieldset>
      <legend>Benefits Information</legend>
      <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
      <div className="input-section">
        Stuff goes here
      </div>
    </fieldset>
    );
  }
}
