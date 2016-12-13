import React from 'react';
import Estimator from '../../utils/Estimator';

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
    e.set_military_status = params.military_status;
    e.set_spouse_active_duty = params.spouse_active_duty;
    e.set_gi_bill_chap = params.gi_bill_chap;
    e.set_number_of_depend = params.number_of_depend;
    e.set_post_911_elig = params.post_911_elig;
    e.set_cumulative_service = params.cumulative_service;
    e.set_enlistment_service = params.enlistment_service;
    e.set_consecutive_service = params.consecutive_service;
    e.set_online = params.online_classes;
    // set institution values
    e.set_institution_type = school.institution_type.name;
    e.set_country = school.country;
    e.set_bah = school.bah;
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
