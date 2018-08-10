/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import LocationDirectionsLink from './search-results/LocationDirectionsLink';
import LocationHours from './LocationHours';
import LocationInfoBlock from './search-results/LocationInfoBlock';
import LocationPhoneLink from './search-results/LocationPhoneLink';
import PropTypes from 'prop-types';
import React, { Component } from 'react';


class MobileSearchResult extends Component {
  constructor() {
    super();

    this.state = {
      expandHours: false,
    };

    this.toggleHours = this.toggleHours.bind(this);
  }

  toggleHours() {
    this.setState({
      expandHours: !this.state.expandHours,
    });
  }

  renderHours() {
    const { expandHours } = this.state;
    const { result } = this.props;

    return (
      <div>
        <p onClick={this.toggleHours} className="pointer">
          <span className="fa fa-clock blue"></span> Hours of operation <span className={`fa ${expandHours ? 'fa-chevron-up' : 'fa-chevron-down'}`}></span>
        </p>
        <div style={{ paddingLeft: '1.3em' }}>
          {expandHours ? <LocationHours location={result}/> : null}
        </div>
      </div>
    );
  }

  render() {
    const { result, currentLocation } = this.props;

    return (
      <div className="facility-result">
        <LocationInfoBlock location={result} currentLocation={currentLocation}/>
        <div>
          <LocationPhoneLink location={result}/>
        </div>
        <p>
          <LocationDirectionsLink location={result}/>
        </p>
      </div>
    );
  }
}

MobileSearchResult.propTypes = {
  result: PropTypes.object,
};

export default MobileSearchResult;
