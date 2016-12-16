import React from 'react';

class ProfileComplaints extends React.Component {

  constructor(props) {
    super(props);
    this.renderCautionProfileSummary = this.renderCautionProfileSummary.bind(this);
    this.renderComplaintBreakdown = this.renderComplaintBreakdown.bind(this);
  }

  renderCautionProfileSummary() {
    const school = this.props.institution;
    if (school.cautionFlag) {
      const reason = school.cautionFlagReason; // TODO: school.cautionFlagReason.try(:chomp, ',').try(:gsub, /,(?!\W)/, ", ")
      return (
        <span>
          <a id="caution-jump-flag" name="caution_jump_flag"></a>
          <table className="usa-table-borderless caution-profile-summary">
            <tr>
              <th><i id="caution-jump-flag-icon" className="fa fa-exclamation-triangle"></i>&nbsp;Caution&nbsp;Flag&nbsp;Reason:</th>
              <td>{reason}&nbsp;<a onClick={() => {this.props.toggleModalDisplay('cautionInfo');}} className="noback-icon"><i className="fa fa-info-circle fa-info-caution"></i></a></td>
            </tr>
          </table>
        </span>
      );
    }
    return null;
  }

  renderComplaintBreakdown() {
    const school = this.props.institution;
    if (Number(school.complaintsMainCampusRollUp) === 0) { return null; }
    return (
      <span>
        {/* TODO: replace multiple oldOnClick attributes */}

        <h3>Complaint Breakdown <span className="caption"><a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#sourcedata" target="_blank" alt="Click here for more information." title="Download data file used for the GI Bill Comparison Tool.">Source</a></span></h3>
        {/* TODO: oldOnClick="track('Tool Tips', 'Complaint Box / Source');" */}
        <table className="complaints-table">
          <thead>
            <th id="institution-name-complaint">{school.institution}</th>
            <th>This Campus</th>
            <th><a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#complaints_all_campuses" target="_blank" alt="Click here for more information." title="The number of closed, Principles of Excellence-related, complaints for schools with the same six-digit OPEID code.">All Campuses</a></th>
            {/* oldOnClick="track('Tool Tips', 'Complaints / All Campuses');" */}
          </thead>
          <tbody>
            <tr className="complaints-student">
              <th><a href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#complaints" target="_blank" alt="Click here for more information." title="The number of closed, Principles of Excellence-related, complaints submitted to VA through the GI Bill Feedback system.">Student Complaints</a></th>
              {/* oldOnClick="track('Tool Tips', 'Complaints / Breakdown');" */}
              <td id="complaint-total-fc">{school.complaintsFacilityCode}</td>
              <td id="complaint-total-all">{school.complaintsMainCampusRollUp}</td>
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
              <td id="complaint-financial-fc">{school.complaintsFinancialByFacCode}</td>
              <td id="complaint-financial-ope">{school.complaintsFinancialByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Quality of Education</td>
              <td id="complaint-quality-fc">{school.complaintsQualityByFacCode}</td>
              <td id="complaint-quality-ope">{school.complaintsQualityByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Refund Issues</td>
              <td id="complaint-refund-fc">{school.complaintsRefundByFacCode}</td>
              <td id="complaint-refund-ope">{school.complaintsRefundByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Recruiting/Marketing Practices</td>
              <td id="complaint-recruiting-fc">{school.complaintsMarketingByFacCode}</td>
              <td id="complaint-recruiting-ope">{school.complaintsMarketingByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Accreditation</td>
              <td id="complaint-accreditation-fc">{school.complaintsAccreditationByFacCode}</td>
              <td id="complaint-accreditation-ope">{school.complaintsAccreditationByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Change in degree plan/requirements</td>
              <td id="complaint-degree-plan-fc">{school.complaintsDegreeRequirementsByFacCode}</td>
              <td id="complaint-degree-plan-ope">{school.complaintsDegreeRequirementsByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Student Loans</td>
              <td id="complaint-loans-fc">{school.complaintsStudentLoansByFacCode}</td>
              <td id="complaint-loans-ope">{school.complaintsStudentLoansByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Grade Policy</td>
              <td id="complaint-grade-policy-fc">{school.complaintsGradesByFacCode}</td>
              <td id="complaint-grade-policy-ope">{school.complaintsGradesByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Transfer of Credits</td>
              <td id="complaint-credit-transfer-fc">{school.complaintsCreditTransferByFacCode}</td>
              <td id="complaint-credit-transfer-ope">{school.complaintsCreditTransferByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Post-Graduation Job Opportunities</td>
              <td id="complaint-job-prep-fc">{school.complaintsJobByFacCode}</td>
              <td id="complaint-job-prep-ope">{school.complaintsJobsByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Release of Transcripts</td>
              <td id="complaint-transcripts-fc">{school.complaintsTranscriptByFacCode}</td>
              <td id="complaint-transcripts-ope">{school.complaintsTranscriptByOpeIdDoNotSum}</td>
            </tr>
            <tr>
              <td>Other</td>
              <td id="complaint-other-fc">{school.complaintsOtherByFacCode}</td>
              <td id="complaint-other-ope">{school.complaintsOtherByOpeIdDoNotSum}</td>
            </tr>
          </tbody>
        </table>
      </span>
    );
  }

  render() {
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
