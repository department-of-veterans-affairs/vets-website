import React from 'react';

class ProfileComplaints extends React.Component {

  constructor(props) {
    super(props);
    this.renderCautionProfileSummary = this.renderCautionProfileSummary.bind(this);
    this.renderComplaintBreakdown = this.renderComplaintBreakdown.bind(this);
  }

  renderCautionProfileSummary() {
    const school = this.props.institution;
    if (school.caution_flag) {
      const reason = school.caution_flag_reason; // school.caution_flag_reason.try(:chomp, ',').try(:gsub, /,(?!\W)/, ", ")
      return (
        <span>
          <a id="caution-jump-flag" name="caution_jump_flag"></a>
          <table className="usa-table-borderless caution-profile-summary">
            <tr>
              <th><i id="caution-jump-flag-icon" className="fa fa-exclamation-triangle"></i>&nbsp;Caution&nbsp;Flag&nbsp;Reason:</th>
              <td>{reason}&nbsp;<a onClick={() => {this.props.toggleModalDisplay('cautionInfo')}} className="noback-icon"><i className="fa fa-info-circle fa-info-caution"></i></a></td>
            </tr>
          </table>
        </span>
      );
    }
    return null;
  }

  renderComplaintBreakdown() {
    const school = this.props.institution;
    if (Number(school.complaints_main_campus_roll_up) === 0) { return null; }
    return (
      <span>
        {/* TODO: replace multiple oldOnClick attributes */}
        <h3>Complaint Breakdown <span className="caption"><a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#sourcedata" oldOnClick="track('Tool Tips', 'Complaint Box / Source');" target="_blank" alt="Click here for more information." title="Download data file used for the GI Bill Comparison Tool.">Source</a></span></h3>
        <table className="complaints-table">
          <thead>
            <th id="institution-name-complaint">{ school.institution }</th>
            <th>This Campus</th>
            <th><a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#complaints_all_campuses" oldOnClick="track('Tool Tips', 'Complaints / All Campuses');" target="_blank" alt="Click here for more information." title="The number of closed, Principles of Excellence-related, complaints for schools with the same six-digit OPEID code.">All Campuses</a></th>
          </thead>
          <tbody>
            <tr className="complaints-student">
              <th><a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#complaints" oldOnClick="track('Tool Tips', 'Complaints / Breakdown');" target="_blank" alt="Click here for more information." title="The number of closed, Principles of Excellence-related, complaints submitted to VA through the GI Bill Feedback system.">Student Complaints</a></th>
              <td id="complaint-total-fc">{ school.complaints_facility_code }</td>
              <td id="complaint-total-all">{ school.complaints_main_campus_roll_up }</td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr className="inner-highlight">
              <th>Complaint by Type<br/><span className="caption">(Each complaint can have multiple types)</span></th>
              <th>Total</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Financial Issues (e.g., Tuition/Fee charges)</td>
              <td id="complaint-financial-fc">{ school.complaints_financial_by_fac_code }</td>
              <td id="complaint-financial-ope">{ school.complaints_financial_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Quality of Education</td>
              <td id="complaint-quality-fc">{ school.complaints_quality_by_fac_code }</td>
              <td id="complaint-quality-ope">{ school.complaints_quality_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Refund Issues</td>
              <td id="complaint-refund-fc">{ school.complaints_refund_by_fac_code }</td>
              <td id="complaint-refund-ope">{ school.complaints_refund_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Recruiting/Marketing Practices</td>
              <td id="complaint-recruiting-fc">{ school.complaints_marketing_by_fac_code }</td>
              <td id="complaint-recruiting-ope">{ school.complaints_marketing_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Accreditation</td>
              <td id="complaint-accreditation-fc">{ school.complaints_accreditation_by_fac_code }</td>
              <td id="complaint-accreditation-ope">{ school.complaints_accreditation_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Change in degree plan/requirements</td>
              <td id="complaint-degree-plan-fc">{ school.complaints_degree_requirements_by_fac_code }</td>
              <td id="complaint-degree-plan-ope">{ school.complaints_degree_requirements_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Student Loans</td>
              <td id="complaint-loans-fc">{ school.complaints_student_loans_by_fac_code }</td>
              <td id="complaint-loans-ope">{ school.complaints_student_loans_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Grade Policy</td>
              <td id="complaint-grade-policy-fc">{ school.complaints_grades_by_fac_code }</td>
              <td id="complaint-grade-policy-ope">{ school.complaints_grades_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Transfer of Credits</td>
              <td id="complaint-credit-transfer-fc">{ school.complaints_credit_transfer_by_fac_code }</td>
              <td id="complaint-credit-transfer-ope">{ school.complaints_credit_transfer_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Post-Graduation Job Opportunities</td>
              <td id="complaint-job-prep-fc">{ school.complaints_job_by_fac_code }</td>
              <td id="complaint-job-prep-ope">{ school.complaints_jobs_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Release of Transcripts</td>
              <td id="complaint-transcripts-fc">{ school.complaints_transcript_by_fac_code }</td>
              <td id="complaint-transcripts-ope">{ school.complaints_transcript_by_ope_id_do_not_sum }</td>
            </tr>
            <tr>
              <td>Other</td>
              <td id="complaint-other-fc">{ school.complaints_other_by_fac_code }</td>
              <td id="complaint-other-ope">{ school.complaints_other_by_ope_id_do_not_sum }</td>
            </tr>
          </tbody>
        </table>
      </span>
    );
  }

  render() {
    const school = this.props.institution;
    return (
      <span>
        {this.renderCautionProfileSummary()}
        {this.renderComplaintBreakdown()}
      </span>
    );
  }

}

ProfileComplaints.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileComplaints.defaultProps = {
  expanded: true
};

export default ProfileComplaints;
