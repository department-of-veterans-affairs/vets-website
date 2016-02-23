import React from 'react';

class VeteranAddressSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Permanent Address</h4>

            <p>For locations outside the U.S. enter City,Country in City box,
              I.e. "Paris,France", and select Foreign Country for State.
            </p>

            <label htmlFor="veteran_street">Street</label>
            <input type="text" name="veteran[street]"/>

            <label htmlFor="veteran_city">City</label>
            <input type="text" name="veteran[city]"/>

            <label htmlFor="veteran_country">Country</label>
            <select name="veteran[country]"><option value="0"></option>
              <option value="1">United States</option>
              <option value="2">France</option>
              <option value="3">Atlantis</option>
            </select>

            <label htmlFor="veteran_state">State</label>
            <select name="veteran[state]"><option value="0"></option>
              <option value="1">California</option>
              <option value="2">Nebraska</option>
              <option value="3">Foriegn</option>
            </select>

            <label htmlFor="veteran_zipcode">Zip Code</label>
            <input type="text" name="veteran[zipcode]"/>

            <label htmlFor="veteran_county">County</label>
            <input type="text" name="veteran[county]"/>

            <label htmlFor="veteran_email">Email address</label>
            <input type="text" name="veteran[email]"/>

            <label htmlFor="veteran_email_confirmation">Re-enter Email address</label>
            <input type="text" name="veteran[email_confirmation]"/>

            <label htmlFor="veteran_home_phone">Home telephone number</label>
            <input type="text" name="veteran[home_phone]"/>

            <label htmlFor="veteran_mobile_phone">Mobile telephone number</label>
            <input type="text" name="veteran[mobile_phone]"/>
          </div>
        </div>
      </div>
    )
  }
}

export default VeteranAddressSection;

