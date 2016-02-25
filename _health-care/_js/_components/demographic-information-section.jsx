import React from 'react';

class DemographicInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Demographic Information</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
                type="checkbox"
                id="veteran_is_spanish_hispanic_latino"
                name="veteran_is_spanish_hispanic_latino"/>
            <label htmlFor="veteran_is_spanish_hispanic_latino">Are you Spanish, Hispanic, or Lantino?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h4>What is your race?</h4>
            <span className="usa-form-hint">You may check more than one.</span>
            <input
                type="checkbox"
                id="veteran_is_american_indian_or_alaksa_native"
                name="veteran_is_american_indian_or_alaksa_native"/>
            <label htmlFor="veteran_is_american_indian_or_alaksa_native">American Indian or Alaksan Native</label>

            <input
                type="checkbox"
                id="veteran_is_black_or_african_american"
                name="veteran_is_black_or_african_american"/>
            <label htmlFor="veteran_is_black_or_african_american">Black or African American</label>

            <input
                type="checkbox"
                id="veteran_is_native_hawaiian_or_other_pacific_islander"
                name="veteran_is_native_hawaiian_or_other_pacific_islander"/>
            <label htmlFor="veteran_is_native_hawaiian_or_other_pacific_islander">Native Hawaiian or Other Pacific Islander</label>

            <input
                type="checkbox"
                id="veteran_is_asian"
                name="veteran[is_asian]"/>
            <label htmlFor="veteran_is_asian">Asian</label>

            <input
                type="checkbox"
                id="veteran_is_white"
                name="veteran_is_white"/>
            <label htmlFor="veteran_is_white">White</label>
          </div>
        </div>
      </div>
    );
  }
}

export default DemographicInformationSection;

