import FacilityDirectionsLink from './search-results/FacilityDirectionsLink';
import FacilityInfoBlock from './search-results/FacilityInfoBlock';
import FacilityPhoneLink from './search-results/FacilityPhoneLink';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import MobileSearchResult from './MobileSearchResult';
import Pagination from '../../common/components/Pagination';
import React, { Component, PropTypes } from 'react';

class ResultsList extends Component {

  handlePageSelect = () => {
  }

  renderMobileView() {
    const { facilities, pagination: { current_page: currentPage, total_pages: totalPages } } = this.props;

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
        <Pagination onPageSelect={() => {}} page={currentPage} pages={totalPages}/>
      </div>
    );
  }

  render() {
    const { facilities, isMobile, inProgress, pagination: { current_page: currentPage, total_pages: totalPages } } = this.props;

    if (inProgress) {
      return (
        <div>
          <LoadingIndicator message="Loading results..."/>
        </div>
      );
    }

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
        <Pagination onPageSelect={() => {}} page={currentPage} pages={totalPages}/>
      </div>
    );
  }
}

ResultsList.propTypes = {
  facilities: PropTypes.array,
  isMobile: PropTypes.bool,
};

export default ResultsList;
