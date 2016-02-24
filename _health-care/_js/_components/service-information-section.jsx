import React from 'react';

class ServiceInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Service Information</h4>

            <label htmlFor="veteran_last_branch_of_service">Last branch of service</label>
            <select name="veteran[last_branch_of_service]">
              <option value="0"></option>
              <option value="1">Army</option>
              <option value="2">Airforce</option>
              <option value="3">Marines</option>
              <option value="4">Navy</option>
            </select>

            <label htmlFor="veteran_last_entry_date">Last entry date</label>
            <input type="date" name="veteran[last_entry_date]"/>

            <label htmlFor="veteran_last_discharge_date">Last discharge date</label>
            <input type="date" name="veteran[last_discharge_date]"/>

            <label htmlFor="veteran_discharge_type">Discharge Type</label>
            <select name="veteran[discharge_type]">
              <option value="0"></option>
              <option value="1">Honorable</option>
              <option value="2">Dishonorable</option>
            </select>
          </div>
        </div>
      </div>
    )
  }
}

export default ServiceInformationSection;

