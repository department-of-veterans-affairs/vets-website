import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import Downshift from 'downshift';

import SearchTypeAhead from './SearchTypeAhead';

import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';
import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';

class SearchMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchAction: replaceWithStagingDomain('https://www.va.gov/search/'),
      userInput: '',
    };
  }

  render() {
    const buttonClasses = classNames(
      this.props.cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger',
    );

    const icon = <IconSearch color="#fff" role="presentation" />;

    return (
      <DropDownPanel
        onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
        buttonText="Search"
        clickHandler={this.props.clickHandler}
        cssClass={buttonClasses}
        id="search-menu"
        icon={icon}
        isOpen={this.props.isOpen}
      >
        <SearchTypeAhead isVisible={this.props.isOpen} />
      </DropDownPanel>
    );
  }
}

SearchMenu.propTypes = {
  cssClass: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
};

export default SearchMenu;
