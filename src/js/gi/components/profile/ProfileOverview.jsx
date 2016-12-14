import React from 'react';
import Modal from '../../../common/components/Modal';
import ProfileCautionFlags from './ProfileCautionFlags';
import ProfileSchoolHeader from './ProfileSchoolHeader';
import ProfileEstimator from './ProfileEstimator';
import ProfileVeteranSummary from './ProfileVeteranSummary';

class ProfileOverview extends React.Component {

  render() {
    return (
      <div className="row">
        <div id="profile-summary" className="print-width">
          <div className="row mobile-padding">
            <div className="small-12 columns nopadding">
              <ProfileCautionFlags institution={this.props.institution}/>
            </div>
            <ProfileSchoolHeader institution={this.props.institution} toggleModalDisplay={this.props.toggleModalDisplay}/>
          </div>
        </div>

        <div className="row">
          <ProfileEstimator institution={this.props.institution} queryParams={this.props.queryParams}/>
        </div>

        <div className="row">
          <ProfileVeteranSummary institution={this.props.institution} toggleModalDisplay={this.props.toggleModalDisplay}/>
        </div>
      </div>
    );
  }

}

ProfileOverview.propTypes = {
  institution: React.PropTypes.object.isRequired,
  queryParams: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileOverview.defaultProps = {
  expanded: true
};

export default ProfileOverview;
