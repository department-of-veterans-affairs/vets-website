import React from 'react';

class SpouseInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div>
          <div className="row">
            <div className="small-12 columns">
              <h4>Spouse's name</h4>
            </div>
            <div className="small-3 columns">
              <label htmlFor="veteran_spouses_first_name">First Name</label>
              <input type="text" name="veteran[spouses][first_name]" />
            </div>
            <div className="small-3 columns">
              <label htmlFor="veteran_spouses_middle_name">Middle Name</label>
              <input type="text" name="veteran[spouses][middle_name]" />
            </div>
            <div className="small-3 columns">
              <label htmlFor="veteran_spouses_last_name">Last Name</label>
              <input type="text" name="veteran[spouses][last_name]" />
            </div>
            <div className="small-3 columns">
              <label htmlFor="veteran_spouses_suffix_name">Suffix</label>
              <select name="veteran[spouses][suffix_name]" ><option value="0"></option>
                <option value="1">Jr.</option>
                <option value="2">Sr.</option></select>
            </div>
          </div>

          <div className="row">
            <div className="small-9 columns">
              <label htmlFor="veteran_spouses_ssn">Spouse&#39;s Social Security Number</label>
            </div>
            <div className="small-3 columns">
              <input type="text" name="veteran[spouses][ssn]" />
            </div>
          </div>

          <div className="row">
            <div className="small-9 columns">
              <label htmlFor="veteran_spouses_date_of_birth">Spouse&#39;s Date of Birth</label>
            </div>
            <div className="small-3 columns">
              <input type="date" name="veteran[spouses][date_of_birth]" />
            </div>
          </div>

          <div className="row">
            <div className="small-9 columns">
              <label htmlFor="veteran_spouses_date_of_marriage">Date of Marriage</label>
            </div>
            <div className="small-3 columns">
              <input type="date" name="veteran[spouses][date_of_marriage]" />
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <input 
                type="checkbox"
                name="veteran_spouses_has_same_address"
                id="veteran_spouses_has_same_address"/>
              <label htmlFor="veteran_spouses_has_same_address">Do you have the same address as your spouse?</label>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <input 
                type="checkbox" 
                name="veteran_spouses_cohabited_last_year"
                id="veteran_spouses_cohabited_last_year"/>
              <label htmlFor="veteran_spouses_cohabited_last_year">Did your spouse live with you last year?</label>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <hr />
              You may count your spouse as your dependent even if you did not live
              together, as long as you contributed support last calendar year.
              <hr />
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <input
                type="checkbox"
                name="veteran_spouses_provided_support_last_year"
                id="veteran_spouses_provided_support_last_year"/>
              <label htmlFor="veteran_spouses_provided_support_last_year">If your spouse did not live with you last year, did you provide support?</label>
            </div>
          </div>
        </div>

        <div>
          <div className="row">
            <div className="small-12 columns">
              <h4>Spouse's Address and Telephone Number</h4>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="veteran_spouses_address">Address</label>
              <input type="text" name="veteran[spouses][address]" />
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="veteran_spouses_city">City</label>
              <input type="text" name="veteran[spouses][city]" />
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="veteran_spouses_country">Country</label>
              <select name="veteran[spouses][country]"><option value="0"></option>
                <option value="1">United States</option>
                <option value="2">France</option>
                <option value="3">Atlantis</option></select>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="veteran_spouses_state">State</label>
              <select name="veteran[spouses][state]"><option value="0"></option>
                <option value="1">California</option>
                <option value="2">Nebraska</option>
                <option value="3">Foriegn</option></select>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="veteran_spouses_zipcode">Zip Code</label>
              <input type="text" name="veteran[spouses][zipcode]" />
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="veteran_spouses_phone">Phone</label>
              <input type="text" name="veteran[spouses][phone]" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SpouseInformationSection;
