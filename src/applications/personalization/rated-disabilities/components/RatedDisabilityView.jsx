import React from 'react';
import PropTypes from 'prop-types';
import RatedDisabilityList from './RatedDisabilityList';

class RatedDisabilityView extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  render() {
    const { fetchRatedDisabilities, ratedDisabilities, user } = this.props;

    let content;

    // Total Disability Calculation and Pending Disabilities should go here.
    if (user.profile.verified) {
      if (user.profile.status === 'OK') {
        content = (
          <>
            <RatedDisabilityList
              fetchRatedDisabilities={fetchRatedDisabilities}
              ratedDisabilities={ratedDisabilities}
            />
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
              <h3>Side Bar here</h3>
            </div>
          </>
        );
      }
    }

    return (
      <div className="vads-l-grid-container">
        <div className="vads-l-row vads-u-margin-x--neg2p5">{content}</div>
      </div>
    );
  }
}

export default RatedDisabilityView;
