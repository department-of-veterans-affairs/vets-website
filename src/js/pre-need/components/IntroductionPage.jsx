import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from '../../common/utils/helpers';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import OMBInfo from '../../common/components/OMBInfo';
import FormTitle from '../../common/schemaform/FormTitle';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply online for pre-need determination of eligibility in a VA National Cemetery"/>
        <p>
          This application is equivalent to Form 40-10007 (Application for pre-need determination of eligibility in a VA National Cemetery).
        </p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Gather these documents and other information you’ll need to identify the deceased:</h5>
              <ul>
                <li>
                  DD214, or similar discharge papers. If you can’t find the discharge papers, please ask for our help to get these records. <a href="http://www.cem.va.gov/CEM/hmm/discharge_documents.asp" target="_blank">Find out which discharge papers we accept along with your application</a>.
                </li>
                <li>
                  Full name, gender, Social Security number or Veteran ID, date of death, and date of birth
                </li>
                <li>
                  Next-of-kin information (name, relationship, Social Security number, phone number, and address)
                </li>
                <li>
                  Marital status
                </li>
              </ul>
              <p>You may also need:</p>
              <ul>
                <li>
                  If the deceased was married, the surviving spouse’s status as Veteran or family member
                </li>
                <li>
                  The status and detailed information for any disabled children who may be buried in the future in a national cemetery
                </li>
                <li>
                  The Veteran’s zip code and county at the time of death
                </li>
                <li>
                  If the deceased is a spouse or a Veteran whose spouse has already died, the full name of the family member, cemetery section, and site number
                </li>
              </ul>
            </li>
            <li className="process-step list-two">
              <h5>Decide on the burial details and gather all related information, including:</h5>
              <ul>
                <li>
                  Your cemetery of choice
                </li>
                <li>
                  Type of gravesite memorial. <a href="/burials-and-memorials/burial-planning/headstones-markers-medallions">See your options for a headstone, marker, or niche cover.</a>
                </li>
                <li>
                  Type of burial: casket or cremation and size of the casket or cremation urn
                </li>
                <li>
                  Whether you want military honors, a burial flag, or a Presidential Memorial Certificate
                </li>
              </ul>
              <div>
                <a href="https://www.dmdc.osd.mil/mfh/getLinks.do?tab=Services" target="_blank">
                  Learn about military honors.
                </a>
              </div>
              <div>
                <a href="/burials-and-memorials/burial-planning/flags-and-memorial-certificates">
                  Learn about other ways to memorialize the deceased.
                </a>
              </div>
            </li>
            <li className="process-step list-three">
              <h5>Fill out the Application</h5>
              <p>Complete the form.</p>
            </li>
            <li className="process-step list-four">
              <h5>VA Review</h5>
              <h6>How long does it take VA to make a decision?</h6>
              <ul><li>We usually process claims within 30 days.</li></ul>
              <h6>What should I do while I wait?</h6>
              <ul><li>The transition from military to civilian life can be challenging. VA offers <a href="/education/tools-programs/education-career-counseling/">tools and counseling programs</a> to help you make the most of your educational options.</li></ul>
              <h6>What if VA needs more information?</h6>
              <ul><li>We will contact you if we need more information.</li></ul>
            </li>
            <li className="process-step list-five">
              <h5>Decision</h5>
              <ul>
                <li>
                  We usually process claims within 30 days.
                </li>
                <li>
                  You’ll get a letter in the mail if your application was approved.
                </li>
              </ul>
            </li>
          </ol>
        </div>
        <div className="row progress-box progress-box-schemaform form-progress-buttons schemaform-buttons">
          <div className="end columns">
            <ProgressButton
                onButtonClick={this.goForward}
                buttonText="Get Started"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
        <div className="omb-info--container">
          <OMBInfo resBurden={20} ombNumber="2900-0784" expDate="11/30/2018"/>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionPage);

export { IntroductionPage };
