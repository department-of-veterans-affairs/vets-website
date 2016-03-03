import React from 'react';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';

class AdditionalInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Additional Information</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="I am enrolling to obtain minimal essential coverage under the affordable care act"
                checked={this.props.data.isEssentialAcaCoverage}
                onValueChange={(update) => {this.props.onStateChange('isEssentialAcaCoverage', update);}}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h4>Select the VA Medical Facility which will be your preferred facility</h4>
            <label htmlFor="veteran_preferred_facility_state">State</label>
            <select name="veteran[preferred_facility_state]" ><option value="0"></option>
              <option value="1">Alaska</option>
              <option value="2">Hawaii</option></select>
            <label htmlFor="veteran_preferred_va_facility">Center/Clinic</label>
            <select name="veteran[preferred_va_facility]" ><option value="0"></option>
              <option value="1">PUG</option>
              <option value="2">Tampa VAMC</option></select>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <ErrorableCheckbox
                label="Do you want VA to contact you to schedule your first appointment?"
                checked={this.props.data.wantsInitialVaContact}
                onValueChange={(update) => {this.props.onStateChange('wantsInitialVaContact', update);}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionalInformationSection;

