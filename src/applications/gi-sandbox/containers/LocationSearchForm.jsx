import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dropdown from '../components/Dropdown';
import { fetchSearchByLocationResults } from '../actions';

export function LocationSearchForm({ fetchSearchByLocation, search }) {
  const [searchLocation, setSearchLocation] = useState(search.query.location);
  const [distance, setDistance] = useState(search.query.distance);

  const doSearch = event => {
    event.preventDefault();
    fetchSearchByLocation(searchLocation, distance);
  };

  return (
    <div>
      <form onSubmit={doSearch}>
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            <div>
              <input
                type="text"
                name="locationSearch"
                className="vads-u-display--inline-block location-search"
                placeholder="city, state, or postal code"
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
              />
              <Dropdown
                className="vads-u-font-style--italic vads-u-display--inline-block vads-u-margin-left--4"
                selectClassName="vads-u-font-style--italic vads-u-color--gray"
                name="distance"
                options={[
                  { optionValue: '5', optionLabel: 'within 5 miles' },
                  { optionValue: '25', optionLabel: 'within 25 miles' },
                  { optionValue: '50', optionLabel: 'within 50 miles' },
                  { optionValue: '75', optionLabel: 'within 75 miles' },
                ]}
                value={distance}
                alt="distance"
                visible
                onChange={e => setDistance(e.target.value)}
              />
            </div>
          </div>
          <div className="medium-screen:vads-l-col--2 vads-u-text-align--right">
            <button type="submit" className="usa-button">
              Search
              <i aria-hidden="true" className="fa fa-search" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  search: state.search,
});

const mapDispatchToProps = {
  fetchSearchByLocation: fetchSearchByLocationResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSearchForm);
