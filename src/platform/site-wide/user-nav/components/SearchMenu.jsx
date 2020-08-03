import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

import SearchForm from './SearchForm';
import SearchTypeahead from './SearchTypeahead';

import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';

const isTypeaheadEnabled = !environment.isProduction();

export default function SearchMenu({ cssClass, clickHandler, isOpen }) {
  const buttonClasses = classNames(
    cssClass,
    'va-btn-withicon',
    'va-dropdown-trigger',
  );

  const icon = <IconSearch color="#fff" role="presentation" />;
  const searchInput = isTypeaheadEnabled ? (
    <SearchTypeahead isVisible={isOpen} />
  ) : (
    <SearchForm />
  );

  return (
    <DropDownPanel
      onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
      buttonText="Search"
      clickHandler={clickHandler}
      cssClass={buttonClasses}
      id="search-menu"
      icon={icon}
      isOpen={isOpen}
    >
      {searchInput}
    </DropDownPanel>
  );
}

SearchMenu.propTypes = {
  cssClass: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
};
