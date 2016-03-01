import React from 'react';

class VaInformationSection extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="small-12 columns">
          <h4>Veteran</h4>
          <p>
            Please review the following list and select all the responses that apply to you.
            This information will be used to determine which sections of the Application for
            Health Benefits you should complete.
          </p>

          <input
              id="veteran_is_service_connected_50_100"
              name="veteran_is_service_connected_50_100"
              type="checkbox"
              value="veteran_is_service_connected_50_100"/>
          <label htmlFor="veteran_is_service_connected_50_100">Are you VA Service Connected 50% to 100% Disabled?</label>

          <input
              id="veteran_is_compensable_va_service_connected_0_40"
              name="veteran_is_compensable_va_service_connected_0_40"
              type="checkbox"
              value="veteran_is_compensable_va_service_connected_0_40"/>
          <label htmlFor="veteran_is_compensable_va_service_connected_0_40">Are you compensable VA Service Connected 0% - 40%?</label>

          <input
              id="veteran_receives_va_pension"
              name="veteran_receives_va_pension"
              type="checkbox"
              value="veteran_receives_va_pension"/>
          <label htmlFor="veteran_receives_va_pension">Do you receive a VA pension?</label>
        </div>
      </div>
    );
  }
}

export default VaInformationSection;
