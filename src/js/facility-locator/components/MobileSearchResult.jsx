import FacilityDirectionsLink from './search-results/FacilityDirectionsLink';
import FacilityHours from './FacilityHours';
import FacilityInfoBlock from './search-results/FacilityInfoBlock';
import FacilityPhoneLink from './search-results/FacilityPhoneLink';
import React, { Component, PropTypes } from 'react';


class MobileSearchResult extends Component {
  render() {
    const { facility } = this.props;

    return (
      <div className="facility-result">
        <FacilityInfoBlock facility={facility}/>
        <p>
          <FacilityPhoneLink facility={facility}/>
        </p>
        <p>
          <FacilityDirectionsLink facility={facility}/>
        </p>
        <p>
          <FacilityHours facility={facility}/>
        </p>
      </div>
    );
  }
}

MobileSearchResult.propTypes = {
  facility: PropTypes.object,
};

export default MobileSearchResult;
