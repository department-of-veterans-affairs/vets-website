import React from 'react';

class ProfileEstimator extends React.Component {

  constructor(props) {
    super(props);
    // this.renderHeader = this.renderHeader.bind(this);
  }

  render() {
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
                <p id="est-tuition-fees" className="profile-benefits-values"></p>
              </div>
            </div>

            <div className="medium-4 columns">
              <div className="text-center benefits-cards">
                <h4>Housing Allowance</h4>
                <div className="icon benefits-estimator-icon-box">
                  <i className="fa fa-home fa-profile-benefits"></i>
                </div>
                <p id="est-housing-allowance" className="profile-benefits-values"></p>
              </div>
            </div>

            <div className="medium-4 columns">
              <div className="text-center benefits-cards">
                <h4>Book Stipend</h4>
                <div className="icon benefits-estimator-icon-box">
                  <i className="fa fa-book fa-profile-benefits"></i>
                </div>
                <p id="est-book-stipend" className="profile-benefits-values"></p>
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
  expanded: React.PropTypes.bool.isRequired
};

ProfileEstimator.defaultProps = {
  expanded: true
};

export default ProfileEstimator;
