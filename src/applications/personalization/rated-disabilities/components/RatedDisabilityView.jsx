import React from 'react';
import PropTypes from 'prop-types';
import RatedDisabilityTable from './RatedDisabilityTable';

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
          <RatedDisabilityTable
            fetchRatedDisabilities={fetchRatedDisabilities}
            ratedDisabilities={ratedDisabilities}
          />
        );
      }
    }

    return (
      <div className="row">
        <div>{content}</div>
      </div>
    );
  }
}

export default RatedDisabilityView;
