import React, { useEffect } from 'react';
import classNames from 'classnames';
import { getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import NameSearchForm from '../../containers/search/NameSearchForm';
import LocationSearchForm from '../../containers/search/LocationSearchForm';
import { TABS } from '../../constants';

export default function SearchTabs({ onChange, search, dispatchError }) {
  const { tab } = search;

  useEffect(
    () => {
      if (search.inProgress) {
        scrollTo('search-form', getScrollOptions());
      }
    },
    [search.inProgress],
  );

  const tabbedSearch = {
    [TABS.name]: <NameSearchForm />,
    [TABS.location]: <LocationSearchForm />,
  };

  const getTab = (tabName, label) => {
    const activeTab = tabName === tab;
    const tabClasses = classNames(
      {
        'active-search-tab': activeTab,
        'vads-u-color--gray-dark': activeTab,
        'vads-u-background-color--white': activeTab,
        'inactive-search-tab': !activeTab,
        'vads-u-color--gray-medium': !activeTab,
        'vads-u-background-color--gray-light-alt': !activeTab,
      },
      'vads-u-font-family--sans',
      'vads-u-flex--1',
      'vads-u-text-align--center',
      'vads-u-font-weight--bold',
      'vads-l-grid-container',
      'vads-u-padding-y--1p5',
      'search-tab',
      `${tabName}-search-tab`,
    );

    return (
      <button
        className={tabClasses}
        aria-selected={activeTab}
        role="tab"
        onClick={() => {
          onChange(tabName);
          dispatchError(null);
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="search-form">
      <div role="tablist" className="vads-u-display--flex">
        {getTab(TABS.name, 'Search by name')}
        {getTab(TABS.location, 'Search by location')}
      </div>
      <div className="search-box">{tabbedSearch[tab]}</div>
    </div>
  );
}
