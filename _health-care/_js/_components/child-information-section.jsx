import React from 'react';

class ChildInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Children Information</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
                type="checkbox"
                name="has_children_to_report"
                id="has_children_to_report"/>
            <label htmlFor="has_children_to_report">Do you have any children to report?</label>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <div className="row">
            </div>

            <div className="row">
              <div className="small-12 columns">
                <p>Child's Name</p>

                <label htmlFor="veteran_children_last_name">Last</label>
                <input type="text" name="veteran[children][last_name]"/>

                <label htmlFor="veteran_children_first_name">First</label>
                <input type="text" name="veteran[children][first_name]"/>

                <label htmlFor="veteran_children_middle_name">Middle</label>
                <input type="text" name="veteran[children][middle_name]"/>

                <label htmlFor="veteran_children_suffix_name">Suffix</label>
                <select name="veteran[children][suffix_name]"><option value="0"></option>
                  <option value="1">Jr.</option>
                  <option value="2">Sr.</option></select>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <p>Child's relationship to you (check one)</p>
              </div>
              <div className="small-12 columns">
                <input type="radio" value="1" name="veteran[children][relation]"/><label htmlFor="veteran_children_relation_1">Son</label><input type="radio" value="2" name="veteran[children][relation]"/><label htmlFor="veteran_children_relation_2">Daughter</label><input type="radio" value="3" name="veteran[children][relation]"/><label htmlFor="veteran_children_relation_3">Stepson</label><input type="radio" value="4" name="veteran[children][relation]"/><label htmlFor="veteran_children_relation_4">Stepdaughter</label>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <label htmlFor="veteran_children_ssn">Child&#39;s Social Security Number</label>
                <input type="text" name="veteran[children][ssn]"/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <label htmlFor="veteran_children_became_dependent">Date child became your dependent</label>
                <input type="date" name="veteran[children][became_dependent]"/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <label htmlFor="veteran_children_date_of_birth">Child&#39;s date of birth</label>
                <input type="date" name="veteran[children][date_of_birth]"/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <input
                    type="checkbox"
                    name="veteran_children_was_permanentaly_disable_before_18"
                    id="veteran_children_was_permanentaly_disable_before_18"/>
                <label htmlFor="veteran_children_was_permanentaly_disable_before_18">Was child permanently and totally disabled before the age of 18?</label>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <input
                    type="checkbox"
                    name="veteran_children_age_18_to_23_attended_school_last_year"
                    id="veteran_children_age_18_to_23_attended_school_last_year"/>
                <label htmlFor="veteran_children_age_18_to_23_attended_school_last_year">If child is between 18 and 23 years of age, did child attend school last calendar year?</label>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <label htmlFor="veteran_children_education_expenses">Expenses paid by your dependent child for college, vocational rehabilitation or training (e.g., tuition, books, materials)?</label>
                $<input type="text" name="veteran[children][education_expenses]" data-validation-type="monetary"/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <input
                    type="checkbox"
                    name="veteran_children_cohabited_last_year"
                    id="veteran_children_cohabited_last_year"/>
                <label htmlFor="veteran_children_cohabited_last_year">Did your child live with you last year?</label>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <p>Count child support contributions even if not paid in regular
                set amounts. Contributions can include tuition payments or
                payments of medical bills.</p>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns">
                <input
                    type="checkbox"
                    name="veteran_children_provided_support_last_year"
                    id="veteran_children_provided_support_last_year"/>
                <label htmlFor="veteran_children_provided_support_last_year">If your dependent child did not live with you last year, did you provide support?</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChildInformationSection;
