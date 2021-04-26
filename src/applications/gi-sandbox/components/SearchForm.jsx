import React, { useState } from 'react';
import classNames from 'classnames';
import Dropdown from './Dropdown';

export default function SearchForm({
  fetchSearchByLocation,
  fetchSearchByName,
}) {
  const [currentTab, setCurrentTab] = useState('name');
  const [searchName, setSearchName] = useState();
  const [searchLocation, setSearchLocation] = useState();
  const [distance, setDistance] = useState('10');

  const classes = classNames(
    'vads-u-border-bottom--2px',
    'vads-u-border-left--2px',
    'vads-u-border-right--2px',
    'vads-u-border-color--gray-light',
    'vads-u-flex--2',
    'vads-u-padding-left--6',
    'vads-u-padding-right--6',
    'vads-u-padding-bottom--3',
    'vads-u-padding-top--4',
  );

  const getTab = (tabName, label) => {
    const tabClasses = classNames(
      {
        'vads-u-border-bottom--4px': tabName === currentTab,
        'vads-u-border-color--primary': tabName === currentTab,
        'vads-u-border-bottom--2px': tabName !== currentTab,
        'vads-u-border-color--gray-light': tabName !== currentTab,
        'vads-u-color--gray-light': tabName !== currentTab,
      },
      'vads-u-font-family--sans',
      'vads-u-flex--1',
      'vads-u-text-align--center',
      'vads-u-font-size--lg',
      'vads-u-font-weight--bold',
      'vads-l-grid-container',
    );

    return (
      <div className={tabClasses} onClick={() => setCurrentTab(tabName)}>
        {label}
      </div>
    );
  };

  const doSearch = () => {
    if (currentTab === 'name') {
      fetchSearchByName(searchName);
    } else {
      fetchSearchByLocation(searchLocation, distance);
    }
  };

  return (
    <div className="search-form">
      <div className="vads-u-display--flex">
        {getTab('name', 'Search by name')}
        {getTab('location', 'Search by location')}
      </div>
      <div className={classes}>
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            {currentTab === 'name' && (
              <input
                type="text"
                name="nameSearch"
                className="name-search"
                placeholder="school, employer, or training provider"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
            )}
            {currentTab === 'location' && (
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
                    { optionValue: '10', optionLabel: 'within 10 miles' },
                    { optionValue: '25', optionLabel: 'within 25 miles' },
                    { optionValue: '50', optionLabel: 'within 50 miles' },
                  ]}
                  value={distance}
                  alt="distance"
                  visible
                  onChange={e => setDistance(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="medium-screen:vads-l-col--2 vads-u-text-align--right">
            <button type="button" className="usa-button" onClick={doSearch}>
              Search
              <i
                style={{ paddingLeft: '16px' }}
                aria-hidden="true"
                className="fa fa-search"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
