import React from 'react';

class AdditionalMilitaryInformationSection extends React.Component {
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
              name="veteran_is_purple_heart_recipient"
              id="veteran_is_purple_heart_recipient"/>
            <label htmlFor="veteran_is_purple_heart_recipient">Are you a Purple Heart award recipient?</label>
          </div>
        </div>


        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_is_former_pow"
              id="veteran_is_former_pow"/>
            <label htmlFor="veteran_is_former_pow">Are you a former prisoner of war?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_has_post_nov_11_1998_combat"
              id="veteran_has_post_nov_11_1998_combat"/>
            <label htmlFor="veteran_has_post_nov_11_1998_combat">Did you serve in combat theater of operations after November 11, 1998?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_is_disabled_in_line_of_duty"
              id="veteran_is_disabled_in_line_of_duty"/>
            <label htmlFor="veteran_is_disabled_in_line_of_duty">Were you discharged or retired from the military for a disability incurred in the line of duty?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_has_sw_asia_combat_aug_2_1990_to_nov_11_1998"
              id="veteran_has_sw_asia_combat_aug_2_1990_to_nov_11_1998"/>
            <label htmlFor="veteran_has_sw_asia_combat_aug_2_1990_to_nov_11_1998">Did you serve in SW Asia during the Gulf War between August 2, 1990 and Nov 11, 1998?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_has_vietnam_service_jan_9_1962_to_may_7_1975"
              id="veteran_has_vietnam_service_jan_9_1962_to_may_7_1975"/>
            <label htmlFor="veteran_has_vietnam_service_jan_9_1962_to_may_7_1975">Did you serve in Vietnam between January 9, 1962 and May 7, 1975?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_is_exposed_to_radiation"
              id="veteran_is_exposed_to_radiation"/>
            <label htmlFor="veteran_is_exposed_to_radiation">Were you exposed to radiation while in the military?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_received_nose_throat_radium_treatments"
              id="veteran_received_nose_throat_radium_treatments"/>
            <label htmlFor="veteran_received_nose_throat_radium_treatments">Did you receive nose and throat radium treatments while in the military?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="checkbox"
              name="veteran_has_camp_lejeune_jan_1_1957_to_dec_31_1987"
              id="veteran_has_camp_lejeune_jan_1_1957_to_dec_31_1987"/>
            <label htmlFor="veteran_has_camp_lejeune_jan_1_1957_to_dec_31_1987">Did you serve on active duty at least 30 days at Camp LeJeune from January 1, 1957 through December 31, 1987?</label>
          </div>
        </div>
      </div>
    )
  }
}

export default AdditionalMilitaryInformationSection;
