/* Component that lets a veteran sort by prescription name,
 * facility, or last requested date.
*/

import React from 'react';
import { browserHistory, Link } from 'react-router';

class SortActive extends React.Component {
  constructor() {
    super();
    this.handleChangeSortMenu = this.handleChangeSortMenu.bind(this);
  }

  handleChangeSortMenu(domEvent) {
    // Updates the window location with a query param.
    browserHistory.push({
      pathname: '/rx',
      query: {
        sort: domEvent.target.value
      }
    });
  }

  render() {
    const sortBys = [{ value: 'prescription-name',
        label: 'Prescription name' },
      { value: 'facility-name',
        label: 'Facility name' },
      { value: 'refill-submit-date',
        label: 'Last requested' }];

    const sortLinks = (options) => {
      return options.map((o, ind) => {
        return (<li key={ind}><Link
            activeClassName="rx-sort-active"
            to={{
              pathname: '/rx',
              query: { sort: `${o.value}` }
            }}>{o.label}</Link></li>);
      });
    };

    const sortOptionElements = (options) => {
      return options.map((o, ind) => {
        return (
          <option
              key={ind}
              value={o.value}>{o.label}</option>
        );
      });
    };

    return (
      <form className="rx-sort va-dnp">
        <div className="rx-sort-wide">
          <label htmlFor="sortby" className="va-disp-ib">Sort by </label>
          <ul className="va-list-ib">
            {sortLinks(sortBys)}
          </ul>
        </div>
        <div className="rx-sort-narrow">
          <select
              id="sortby"
              onChange={this.handleChangeSortMenu}>
            {sortOptionElements(sortBys)}
          </select>
        </div>
      </form>
    );
  }
}

export default SortActive;
