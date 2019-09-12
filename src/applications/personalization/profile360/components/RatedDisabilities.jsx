import React from 'react';
import PropTypes from 'prop-types';

import featureFlags from '../featureFlags';

class RatedDisabilities extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  componentDidMount() {
    this.props.fetchRatedDisabilities();
  }

  render() {
    if (!featureFlags.ratedDisabilities) {
      return null;
    }

    if (!this.props.ratedDisabilities) {
      return <h1>Loading!</h1>;
    }

    return (
      <>
        <h2 className="va-profile-heading">Rated disabilities</h2>
        <code>{JSON.stringify(this.props.ratedDisabilities)}</code>;
      </>
    );
  }
}

export default RatedDisabilities;
