import React, { useEffect } from 'react';
import classNames from 'classnames';
import NameSearchForm from '../../containers/NameSearchForm';
import LocationSearchForm from '../../containers/LocationSearchForm';
import NameResults from './NameResults';
import LocationSearchResults from '../../containers/search/LocationSearchResults';
import { TABS } from '../../constants';
import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';

export default function SearchTabs({ onChange, search }) {
  const { tab } = search;

  useEffect(
    () => {
      if (search.inProgress) {
        scroller.scrollTo('search-form', getScrollOptions());
      }
    },
    [search.inProgress],
  );

  const tabbedSearch = {
    [TABS.name]: <NameSearchForm />,
    [TABS.location]: <LocationSearchForm />,
  };

  const tabbedResults = {
    [TABS.name]: <NameResults search={search} />,
    [TABS.location]: <LocationSearchResults />,
  };

  const getTab = (tabName, label) => {
    const tabClasses = classNames(
      {
        'vads-u-border-bottom--4px': tabName === tab,
        'vads-u-border-color--primary': tabName === tab,
        'vads-u-border-bottom--2px': tabName !== tab,
        'vads-u-border-color--gray-light': tabName !== tab,
        'vads-u-color--gray-light': tabName !== tab,
      },
      'vads-u-font-family--sans',
      'vads-u-flex--1',
      'vads-u-text-align--center',
      'vads-u-font-weight--bold',
      'vads-l-grid-container',
      'vads-u-padding-bottom--1p5',
      'search-tab',
    );

    return (
      <div className={tabClasses} onClick={() => onChange(tabName)}>
        {label}
      </div>
    );
  };

  return (
    <div>
      <div id="search-form" className="search-form">
        <div className="vads-u-display--flex">
          {getTab(TABS.name, 'Search by name')}
          {getTab(TABS.location, 'Search by location')}
        </div>
        <div className="search-box">{tabbedSearch[tab]}</div>
      </div>
      {tabbedResults[tab]}
    </div>
  );
}
