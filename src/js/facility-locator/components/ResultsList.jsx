import FacilityDirectionsLink from './search-results/FacilityDirectionsLink';
import FacilityHours from './FacilityHours';
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

    if (isMobile) {
      return this.renderMobileView();
    }

    return (
      <div>
        <table className="usa-table-borderless facility-result">
          <thead>
            <tr>
              <th scope="col">Facility Information</th>
              <th scope="col">Contact</th>
              <th scope="col">Getting There</th>
              <th scope="col">Hours of Operation</th>
            </tr>
          </thead>
          <tbody>
            {
              facilities.map(f => {
                return (
                  <tr key={f.id} className="facility-result">
                    <td><FacilityInfoBlock facility={f}/></td>
                    <td><FacilityPhoneLink facility={f}/></td>
                    <td><FacilityDirectionsLink facility={f}/></td>
                    <td><FacilityHours facility={f}/></td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
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
