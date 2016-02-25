import React from 'react';

class InsuranceInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Insurance Information </h4>
            <input
                id="veteran_is_covered_by_health_insurance"
                name="veteran_is_covered_by_health_insurance"
                type="checkbox"/>
            <label htmlFor="veteran_is_covered_by_health_insurance">Are you covered by health insurance? (Including coverage through a spouse or another person)</label>
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="veteran_health_insurances_name">Name</label>
            <input type="text" name="veteran[health_insurances][name]"/>

            <label htmlFor="veteran_health_insurances_address">Address</label>
            <input type="text" name="veteran[health_insurances][address]"/>

            <label htmlFor="veteran_health_insurances_city">City</label>
            <input type="text" name="veteran[health_insurances][city]"/>

            <label htmlFor="veteran_health_insurances_country">Country</label>
            <select name="veteran[health_insurances][country]" >
              <option value="0"></option>
              <option value="1">United States</option>
              <option value="2">France</option>
              <option value="3">Atlantis</option></select>

            <label htmlFor="veteran_health_insurances_state">State</label>
            <select name="veteran[health_insurances][state]" >
              <option value=""></option>
              <option value="1">California</option>
              <option value="2">Nebraska</option>
              <option value="3">Foriegn</option></select>

            <label htmlFor="veteran_health_insurances_zipcode">Address</label>
            <input type="text" name="veteran[health_insurances][zipcode]"/>

            <label htmlFor="veteran_health_insurances_phone">Phone</label>
            <input type="text" name="veteran[health_insurances][phone]"/>

            <label htmlFor="veteran_health_insurances_policy_holder_name">Name of Policy Holder</label>
            <input type="text" name="veteran[health_insurances][policy_holder_name]"/>

            <label htmlFor="veteran_health_insurances_policy_number">Policy Number</label>
            <input type="text" name="veteran[health_insurances][policy_number]"/>

            <label htmlFor="veteran_health_insurances_group_code">Group Code</label>
            <input type="text" name="veteran[health_insurances][group_code]"/>
          </div>
        </div>
      </div>
    );
  }
}

export default InsuranceInformationSection;
