import React from 'react';
import Estimator from '../../utils/estimator';

class ProfileEstimator extends React.Component {

  constructor(props) {
    super(props);
    this.estimate = this.estimate.bind(this);
  }

  // WIP
  estimate() {
    const school = this.props.institution;
    const params = this.props.queryParams;
    // get current values about the user
    const e = this.props.estimator;
    e.setMilitaryStatus = params.military_status;
    e.setSpouseActiveDuty = params.spouse_active_duty;
    e.setGiBillChap = params.gi_bill_chap;
    e.setNumberOfDepend = params.number_of_depend;
    e.setPost911Elig = params.post_911_elig;
    e.setCumulativeService = params.cumulative_service;
    e.setEnlistmentService = params.enlistment_service;
    e.setConsecutiveService = params.consecutive_service;
    e.setOnline = params.online_classes;
    // set institution values
    e.setInstitutionType = school.institutionType.name;
    e.setCountry = school.country;
    e.setBah = school.bah;
  }

  render() {
    this.estimate();

    return (
      <div id="benefits" className="large-12 columns accordion-vert-spacing">
        <ul className="accordion" data-accordion>
          <li className="accordion-navigation blueback-header">
            <h5>Your Estimated Benefits</h5>

            <div className="medium-4 columns">
              <div className="text-center benefits-cards">
                <h4>Tuition and Fees</h4>
                <div className="icon benefits-estimator-icon-box">
                  <i className="fa fa-graduation-cap fa-profile-benefits"></i>
                </div>
                <p id="est-tuition-fees" className="profile-benefits-values">
                  {this.props.estimator.renderTuitionFees()}
                </p>
              </div>
            </div>

            <div className="medium-4 columns">
              <div className="text-center benefits-cards">
                <h4>Housing Allowance</h4>
                <div className="icon benefits-estimator-icon-box">
                  <i className="fa fa-home fa-profile-benefits"></i>
                </div>
                <p id="est-housing-allowance" className="profile-benefits-values">
                  {this.props.estimator.renderHousingAllowance()}
                </p>
              </div>
            </div>

            <div className="medium-4 columns">
              <div className="text-center benefits-cards">
                <h4>Book Stipend</h4>
                <div className="icon benefits-estimator-icon-box">
                  <i className="fa fa-book fa-profile-benefits"></i>
                </div>
                <p id="est-book-stipend" className="profile-benefits-values">
                  {this.props.estimator.renderBookStipend()}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }

}

ProfileEstimator.propTypes = {
  institution: React.PropTypes.object.isRequired,
  queryParams: React.PropTypes.object.isRequired
};

ProfileEstimator.defaultProps = {
  estimator: new Estimator()
};

export default ProfileEstimator;
