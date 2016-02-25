import React from 'react';

class MedicareMedicaidSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Medicare/Medicaid</h4>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <input
                id="veteran_is_medicaid_eligible"
                name="veteran_is_medicaid_eligible"
                type="checkbox"/>
            <label htmlFor="veteran_is_medicaid_eligible">Are you eligible for medicaid?</label>
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            Medicaid is a United States Health program for eligible individuals and
            families with low income and resources.
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <input
                id="veteran_is_enrolled_medicare_part_a"
                name="veteran_is_enrolled_medicare_part_a"
                type="checkbox"/>
            <label htmlFor="veteran_is_enrolled_medicare_part_a">Are you enrolled in medicare hospital insurance part a?</label>
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            Medicare is a social insurance program administered by the United
            States government, providing health insurance coverage to people aged
            65 and over, or who meet special criteria.
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="veteran_medicare_part_a_effective_date">Effective Date</label>
            <input type="date" name="veteran[medicare_part_a_effective_date]"/>
          </div>
        </div>
      </div>
    );
  }
}

export default MedicareMedicaidSection;

