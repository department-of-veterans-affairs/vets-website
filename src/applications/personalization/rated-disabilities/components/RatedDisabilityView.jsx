import React from 'react';
import PropTypes from 'prop-types';
import RatedDisabilityList from './RatedDisabilityList';
import TotalRatedDisabilities from '../components/TotalRatedDisabilities';
import RatedDisabilitiesSidebar from '../components/RatedDisabilitiesSidebar';

class RatedDisabilityView extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  render() {
    const {
      fetchRatedDisabilities,
      ratedDisabilities,
      user,
      totalDisabilityRating,
      loading,
      error,
    } = this.props;

    let content;

    // Total Disability Calculation and Pending Disabilities should go here.
    if (user.profile.verified) {
      if (user.profile.status === 'OK') {
        content = (
          <>
            <div className="vads-l-col--12 medium-screen:vads-l-col--8">
              <TotalRatedDisabilities
                totalDisabilityRating={totalDisabilityRating}
                loading={loading}
                error={error}
              />
              <RatedDisabilityList
                fetchRatedDisabilities={fetchRatedDisabilities}
                ratedDisabilities={ratedDisabilities}
              />
            </div>
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <RatedDisabilitiesSidebar />
            </div>
          </>
        );
      }
    }

    return (
      <div className="vads-l-grid-container vads-u-padding-bottom--4">
        <div className="vads-l-row">{content}</div>
      </div>
    );
  }
}

export default RatedDisabilityView;
