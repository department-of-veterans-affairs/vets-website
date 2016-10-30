import FacilityDirectionsLink from './search-results/FacilityDirectionsLink';
import FacilityInfoBlock from './search-results/FacilityInfoBlock';
import FacilityPhoneLink from './search-results/FacilityPhoneLink';
import MobileSearchResult from './MobileSearchResult';
import Pagination from '../../common/components/Pagination';
import React, { Component, PropTypes } from 'react';

class ResultsList extends Component {

  renderMobileView() {
    const { facilities } = this.props;

    return (
      <div>
        <div>
          {
            facilities.map(f => {
              return (
                <div key={f.id} className="mobile-search-result">
                  <MobileSearchResult facility={f}/>
                </div>
              );
            })
          }
        </div>
        <Pagination onPageSelect={() => {}} page={1} pages={1}/>
      </div>
    );
  }

  render() {
    const { facilities, isMobile } = this.props;

    if (!facilities || facilities.length < 1) {
      return (
        <div className="facility-result">No facilities found.</div>
      );
    }

    if (isMobile) {
      return this.renderMobileView();
    }

    return (
      <div>
        <div>
          {
            facilities.map(f => {
              return (
                <div key={f.id} className="facility-result" id={f.id}>
                  <FacilityInfoBlock facility={f}/>
                  <FacilityPhoneLink facility={f}/><br/>
                  <FacilityDirectionsLink facility={f}/>
                </div>
              );
            })
          }
        </div>
        <Pagination onPageSelect={() => {}} page={1} pages={1}/>
      </div>
    );
  }
}

ResultsList.propTypes = {
  facilities: PropTypes.array,
  isMobile: PropTypes.bool,
};

export default ResultsList;
