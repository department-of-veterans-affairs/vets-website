import React from 'react';
import Modal from '../../../common/components/Modal';
import ProfileCautionFlags from './ProfileCautionFlags';
import ProfileSchoolHeader from './ProfileSchoolHeader';
import ProfileEstimator from './ProfileEstimator';
import ProfileVeteranSummary from './ProfileVeteranSummary';

class ProfileOverview extends React.Component {

  constructor(props) {
    super(props);
    // this.renderHeader = this.renderHeader.bind(this);
  }

  renderModals() {
    return (
      <div>
        <Modal onClose={() => {console.log('vetgroups')}} visible={!!false}>
          <h3>Student Veterans Group</h3>
          <p>Does this college/university have a student led student veterans group on campus?</p>
          <p>
            If a school has a student veterans group that is not represented on
            the comparison tool, please let us know by emailing us at&nbsp;
            <a title="224A.VBAVACO@va.gov" href="mailto: 224A.VBACO@va.gov?subject=Comparison Tool" id="anch_436">224A.VBAVACO@va.gov</a>.
            Based on your feedback, we will be making quarterly updates to the
            GI Bill Comparison Tool.
          </p>
          <p>
            Please note this email address is only for website related issues,
            all questions regarding GI Bill benefits should be directed to the
            <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/ask" target="_blank">"Ask a Question"</a>
            section of our website.</p>
        </Modal>

        <Modal onClose={() => {console.log('gibillstudents')}} visible={!!false}>
          <h3>GI Bill Beneficiaries</h3>
          <p>The number of Veterans, Servicemembers and family members utilizing their GI Bill benefits attending this institution the previous calendar year. This number includes all the different chapters of the GI Bill (e.g., <a title="Post-9/11" href="http://www.benefits.va.gov/gibill/post911_gibill.asp" id="anch_423" target="_blank">Post-9/11</a>, <a title="Montgomery GI Bill: MGIB" href="http://www.benefits.va.gov/gibill/montgomery_bill.asp" id="anch_424" target="_blank">Montgomery GI Bill: MGIB</a>, <a title="Reserve Education Assistance Program-REAP" href="http://www.benefits.va.gov/gibill/reap.asp" id="anch_425" target="_blank">Reserve Education Assistance Program-REAP</a>, and <a href="http://www.benefits.va.gov/vocrehab/index.asp" id="anch_426" target="_blank">Vocational Rehabilitation</a>). Please keep in mind that we include this number for informational purposes only and that high or low numbers of VA beneficiaries attending a particular school is not an indication one school is more military friendly than another. This information will be updated annually.</p>
        </Modal>

        <Modal onClose={() => {console.log('yribbon')}} visible={!!false}>
          <h3>Yellow Ribbon</h3>
          <p>The <a title="Post-9/11 GI Bill" href="http://www.benefits.va.gov/gibill/post911_gibill.asp" id="anch_420" target="_blank">Post-9/11 GI Bill</a> can cover all in-state tuition and fees at public degree granting schools, but may not cover all private degree granting schools and out-of-state tuition. The Yellow Ribbon Program provides additional support in those situations. Institutions voluntarily enter into an agreement with VA to fund uncovered charges. VA matches each dollar of unmet charges the institution agrees to contribute, up to the total cost of the tuition and fees. <a title="Click here for FAQs about the Yellow Ribbon Program" href="http://www.benefits.va.gov/gibill/docs/factsheets/2012_Yellow_Ribbon_Student_FAQs.pdf" id="anch_421" target="_blank">Click here for FAQs about the Yellow Ribbon Program</a></p>
          <p>Only Veterans entitled to the maximum benefit rate (based on service requirements) or their designated transferees may receive this funding. Active duty Servicemembers and their spouses are not eligible for this program (child transferees of active duty Servicemembers may be eligible if the servicemember is qualified at the 100% rate). This information will be updated quarterly.&nbsp;</p>
        </Modal>

        <Modal onClose={() => {console.log('poe')}} visible={!!false}>
          <h3>Principles of Excellence</h3>
          <p>The <a title="Principles of Excellence" href="http://www.gpo.gov/fdsys/pkg/FR-2012-05-02/pdf/2012-10715.pdf" id="anch_418" target="_blank">Principles of Excellence</a> are guidelines for educational institutions receiving Federal funding. Schools that agree to participate will:</p>
          <ul className="modal-bullets">
            <li>Provide students with a personalized form covering the total cost of an education program.</li>
            <li>Provide educational plans for all Military and Veteran education beneficiaries.</li>
            <li>End fraudulent and aggressive recruiting techniques and misrepresentation.</li>
            <li>Provide accommodations for Service Members and Reservists absent due to service requirements.</li>
            <li>Designate a Point of Contact for academic and financial advising.</li>
            <li>Ensure accreditation of all new programs prior to enrolling students.</li>
            <li>Align institutional refund policies with those under Title IV.</li>
          </ul>
          <p>Foreign schools, high schools, on-the-job training and apprenticeship programs, residency and internship programs, and those who do not charge tuition and fees were not asked to comply with the Principles of Excellence.</p>
          <p>While every effort has been made to ensure the accuracy of the information, prospective students should only use this as a planning tool. The Principles of Excellence schools will be updated quarterly.&nbsp;</p>
        </Modal>

        <Modal onClose={() => {console.log('poe')}} visible={!!false}>
          <h3>GI Bill® Comparison Tool: About This Tool</h3>
          <p>VA is making it easier to research colleges and employers approved for the GI Bill. Answer just a few questions about yourself and the school/employer you are considering. You’ll receive an estimate of your GI Bill benefits and some information about the facility’s value and affordability.</p>
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div id="profile-summary" className="print-width">
          <div className="row mobile-padding">
            <div className="small-12 columns nopadding">
              <ProfileCautionFlags institution={this.props.institution}/>
            </div>
            <ProfileSchoolHeader institution={this.props.institution}/>
          </div>
        </div>

        <div className="row">
          <ProfileEstimator institution={this.props.institution}/>
        </div>

        <div className="row">
          <ProfileVeteranSummary institution={this.props.institution}/>
        </div>

        {this.renderModals()}
      </div>
    );
  }

}

ProfileOverview.propTypes = {
  institution: React.PropTypes.object.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileOverview.defaultProps = {
  expanded: true
};

export default ProfileOverview;
