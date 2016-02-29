import React from 'react';

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
            <input
                type="checkbox"
                id="veteran_is_essential_aca_coverage"
                name="veteran_is_essential_aca_coverage"/>
            <label htmlFor="veteran_is_essential_aca_coverage">I am enrolling to obtain minimal essential coverage under the affordable care act</label>
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
            <input
                type="checkbox"
                name="veteran_wants_initial_va_contact"
                id="veteran_wants_initial_va_contact"/>
            <label htmlFor="veteran_wants_initial_va_contact">Do you want VA to contact you to schedule your first appointment?</label>
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionalInformationSection;

