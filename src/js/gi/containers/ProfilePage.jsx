import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Modal from '../../common/components/Modal';
import AboutYourselfFields from '../components/AboutYourselfFields';
import ProfileOverview from '../components/profile/ProfileOverview';
import ProfileCalculator from '../components/profile/ProfileCalculator';
import RetentionRates from '../components/profile/RetentionRates';
import GraduationRates from '../components/profile/GraduationRates';
import SalaryRates from '../components/profile/SalaryRates';
import RepaymentRates from '../components/profile/RepaymentRates';
import ProfileSummary from '../components/profile/ProfileSummary';
import ProfileComplaints from '../components/profile/ProfileComplaints';
import ProfileHistory from '../components/profile/ProfileHistory';

import schoolData from '../mocks/institution';


class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderPageTitle = this.renderPageTitle.bind(this);
    this.renderModals = this.renderModals.bind(this);
  }

  renderPageTitle() {
    // school_name = @school.institution.gsub(/\b-\b/, " - ")
    //     .split(/\s/).map(&:capitalize).join(" ").gsub(" - ", "-")
    document.title = "[school name] - GI Bill Comparison Tool";
  }

  renderHeader() {
    return (
      <div className="row">
        <h1 className="va-heading-sans">GI Bill Comparison Tool Search Results</h1>
      </div>
    );
  }

  renderModals() {
    return (
      <span>
        <Modal onClose={() => {console.log('retention')}} visible={!!false}>
          <h3>Retention Rates</h3>
          <p>
            The share of first-time, full-time undergraduates who returned to
            the institution after their freshman year.
          </p>
        </Modal>
        <Modal onClose={() => {console.log('gradrates')}} visible={!!false}>
          <h3>Graduation Rates</h3>
          <p>
            The graduation rate after six years for schools that award
            predominantly four-year degrees and after four years for all other
            schools. These rates are only for full-time students enrolled for
            the first time.
          </p>
          <p>
            Student veteran graduation rates measure full-time Post-9/11 GI Bill
            student's graduation reported within the VA system while the student
            is using benefits.
          </p>
        </Modal>
        <Modal onClose={() => {console.log('salaries')}} visible={!!false}>
          <h3>Average Salaries</h3>
          <p>
            The median earnings of former students who received federal
            financial aid, at 10 years after entering school.
          </p>
        </Modal>
        <Modal onClose={() => {console.log('repayment')}} visible={!!false}>
          <h3>Repayment Rate</h3>
          <p>
            The share of students who have repaid at least $1 of the
            principal balance on their federal loans within 3 years of leaving
            school.
          </p>
        </Modal>
      </span>
    );
  }

  renderBackLink() {
    if (this.source == 'home') {
      return null;
    }
    return (
      <div className="row onerempadleft">
        <div id="backtosearch-noprint">
          <a id="back-link" href="#" className="backlink">
            <i className="fa fa-chevron-left back-chevron"></i>
            Back to Search Results
          </a>
        </div>
      </div>
    );
  }

  renderOutcomeMeasuresLink() {
    return (
      <span>
        <p>Access a comprehensive spreadsheet of <a id="veteran-outcome-spreadsheet-link-out" title="Veteran Outcome Measures" href="http://www.benefits.va.gov/gibill/docs/OutcomeMeasuresDashboard.xlsx" id="anch_373" target="_blank">Veteran Outcome Measures</a> (<i className="fa fa-file-excel-o info-icons"></i> | 14.4 MB)</p>
      </span>
    );
  }

  renderNotFound() {
    document.title = 'Institution Not Found - GI Bill Comparison Tool';
    return (
      <div className="section one">
        <p>
          Unknown facility code.<br/>
          Please search for an institution.
        </p>
      </div>
    );
  }

  render() {
    // error message if facility code is unkown / institution not found?
    if (this.props.institution == null) { return renderNotFound(); }
    this.renderPageTitle();
    return (
      <span className="profile-page-component">
        <div className="section">
          <Breadcrumbs currentLabel="Institution"/>
          {this.renderHeader()}

          <div className="action-bar">
            <div className="row">
              <div className="small-10 medium-10 columns filter-horizontal" id="horiz-filters-noprint2">
                <AboutYourselfFields labels={false}/>
              </div>
              <div className="medium-2 columns">
                <a href="#">
                  <button type="button">Reset Search</button>
                </a>
              </div>
            </div>
          </div>

          <div className="section one">
            {this.renderBackLink()}

            <div className="row">
              <div className="large-12 columns">
                <ProfileOverview institution={this.props.institution}/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns accordion-vert-spacing">
                <ProfileCalculator institution={this.props.institution}/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns accordion-vert-spacing">
                <div className="row">
                  <RetentionRates institution={this.props.institution}/>
                  <GraduationRates institution={this.props.institution}/>
                </div>
                <div className="row">
                  <SalaryRates institution={this.props.institution}/>
                  <RepaymentRates institution={this.props.institution}/>
                </div>
              </div>
              <div className="small-12 columns access-sheet clearfix">
                {this.renderOutcomeMeasuresLink()}
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns accordion-vert-spacing">
                <ProfileSummary institution={this.props.institution}/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns accordion-vert-spacing">
                <ProfileComplaints institution={this.props.institution}/>
              </div>
            </div>

            <div className="row">
              <div className="small-12 columns accordion-vert-spacing">
                <ProfileHistory institution={this.props.institution}/>
              </div>
            </div>

          </div>
        </div>

        {this.renderModals()}
      </span>
    );
  }
}

ProfilePage.defaultProps = {
  institution: schoolData().data[0]
};

export default ProfilePage;
