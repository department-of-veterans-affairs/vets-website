import React from 'react';
import PropTypes from 'prop-types';

class RatedDisabilities extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array
    })
  };

  componentDidMount() {
    this.props.fetchRatedDisabilities();
  }

  render() {
    if (!this.props.ratedDisabilities) {
      return <h1>Loading!</h1>;
    }

    return (
      <code>{JSON.stringify(this.props.ratedDisabilities)}</code>
    );
  }
}

export default RatedDisabilities;
