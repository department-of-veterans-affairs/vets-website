import React from 'react';
import PropTypes from 'prop-types';

class RatedDisabilities extends React.Component {

  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchRatedDisabilities();
  }

  render() {
    return (
      <h1>Rated Disabilities!</h1>
    );
  }

}

export default RatedDisabilities;
