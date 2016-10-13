import React, { Component, PropTypes } from 'react';
import FacilityInfoBlock from './search-results/FacilityInfoBlock';
import FacilityDirectionsLink from './search-results/FacilityDirectionsLink';
import FacilityPhoneLink from './search-results/FacilityPhoneLink';
import Pagination from '../../rx/components/Pagination';

class ResultsList extends Component {
  render() {
    const { facilities } = this.props;

    return (
      <div>
        <table className="usa-table-borderless facility-result">
          <thead>
            <tr>
              <th scope="col" colSpan={2}>Facility Information</th>
              <th scope="col">Contact</th>
              <th scope="col">Getting There</th>
              <th scope="col">Hours of Operation</th>
            </tr>
          </thead>
          <tbody>
            {
              facilities.map((f, i) => {
                return (
                  <tr key={f.id}>
                    <td>{i + 1}.</td>
                    <td><FacilityInfoBlock facility={f}/></td>
                    <td><FacilityPhoneLink facility={f}/></td>
                    <td><FacilityDirectionsLink facility={f}/></td>
                    <td>Hours</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <Pagination onPageSelect={() => {}} page={1} pages={1}/>
      </div>
    );

    // return (
    //   <div>
    //     <ol>
    //       {
    //         facilities.map(f => {
    //           return (
    //             <li key={f.id}>
    //               <SearchResult facility={f}/>
    //             </li>
    //           );
    //         })
    //       }
    //     </ol>
    //     <Pagination onPageSelect={() => {}} page={1} pages={1}/>
    //   </div>
    // );
  }
}

ResultsList.propTypes = {
  facilities: PropTypes.array,
  mobile: PropTypes.bool,
};

export default ResultsList;
