import FacilityDirectionsLink from './search-results/FacilityDirectionsLink';
import FacilityHours from './FacilityHours';
import FacilityInfoBlock from './search-results/FacilityInfoBlock';
import FacilityPhoneLink from './search-results/FacilityPhoneLink';
import React, { Component, PropTypes } from 'react';


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
    const { facility } = this.props;

    return (
      <div>
        <p onClick={this.toggleHours} className="pointer">
          <span className="fa fa-clock blue"></span> Hours of operation <span className={`fa ${expandHours ? 'fa-chevron-up' : 'fa-chevron-down'}`}></span>
        </p>
        <div style={{ paddingLeft: '1.3em' }}>
          {expandHours ? <FacilityHours facility={facility}/> : null}
        </div>
      </div>
    );
  }

  render() {
    const { facility } = this.props;

    return (
      <div className="facility-result">
        <FacilityInfoBlock facility={facility}/>
        <p>
          <FacilityPhoneLink facility={facility}/>
        </p>
        <p>
          <span>
            <a href="#" target="_blank">
              <i className="fa fa-globe-o" style={{ marginRight: '0.5rem' }}/> Website
            </a>
          </span>
        </p>
        <p>
          <FacilityDirectionsLink facility={facility}/>
        </p>
        <div>
          {this.renderHours()}
        </div>
      </div>
    );
  }
}

MobileSearchResult.propTypes = {
  facility: PropTypes.object,
};

export default MobileSearchResult;
