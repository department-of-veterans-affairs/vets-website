import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { replaceDomainsInData } from 'platform/utilities/environment/stagingDomains';
import MY_VA_LINK from '../constants/MY_VA_LINK';
import MY_HEALTH_LINK from '../constants/MY_HEALTH_LINK';
import MegaMenu from '../components/MegaMenu';
import authenticatedUserLinkData from '../mega-menu-link-data-for-authenticated-users';
import recordEvent from '../../../monitoring/record-event';
import { isLoggedIn } from '../../../user/selectors';
import {
  toggleMobileDisplayHidden,
  togglePanelOpen,
  updateCurrentSection,
} from '../actions';
import { toggleValues } from '../../feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '../../../utilities/feature-toggles/featureFlagNames';

const tabbableSelectors =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Adds { currentPage: true } to a link object when the current path starts
 * with link.href.
 *
 * @param {Array} links - links to be displayed on right-side of header
 * @param {String} [pathname=window.location.pathname] - optional pathname arg
 * @return {Array}
 */
export function flagCurrentPageInTopLevelLinks(
  links = [],
  pathname = window.location.pathname,
) {
  const currentPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return links.map(
    link =>
      currentPath.startsWith(link.href) ? { ...link, currentPage: true } : link,
  );
}

export function getAuthorizedLinkData(
  loggedIn,
  defaultLinks,
  authenticatedLinks = authenticatedUserLinkData,
) {
  return [
    ...(defaultLinks ? replaceDomainsInData(defaultLinks) : []),
    ...(loggedIn ? replaceDomainsInData(authenticatedLinks) : []),
  ];
}

export class Main extends Component {
  toggleDropDown = currentDropdown => {
    const isVisible = !!currentDropdown;
    if (isVisible) {
      recordEvent({
        event: 'nav-header-top-level',
        'nav-header-action': `Navigation - Header - Open Top Level - ${currentDropdown}`,
      });
    }
    this.props.togglePanelOpen(currentDropdown);
  };

  updateCurrentSection = currentSection => {
    if (currentSection) {
      recordEvent({
        event: 'nav-header-second-level',
        'nav-header-action': `Navigation - Header - Open Second Level - ${currentSection}`,
      });
    }

    this.props.updateCurrentSection(currentSection);
  };

  linkClicked = link => {
    const linkName = link.text || link.title;
    const { currentSection } = this.props;
    recordEvent({
      event: 'nav-header-link',
      'nav-header-action': `Header - ${currentSection} - ${linkName}`,
    });
  };

  columnThreeLinkClicked = link => {
    const { currentSection } = this.props;
    recordEvent({
      event: 'nav-hub-containers',
      'nav-hub-action': `Header - ${currentSection} - ${link.text}`,
    });
  };

  toggleDisplayHidden = hidden => {
    this.props.toggleMobileDisplayHidden(hidden);
  };

  focusTrap = event => {
    const buttonContainer = document.getElementById('va-nav-controls');
    const megaMenuContainer = document.getElementById('mega-menu-mobile');
    const focusable = [
      ...Array.from(buttonContainer.querySelectorAll(tabbableSelectors)).filter(
        el =>
          el.getAttribute('tabindex') !== '-1' &&
          el.getAttribute('hidden') === null,
      ),
      ...Array.from(
        megaMenuContainer.querySelectorAll(tabbableSelectors),
      ).filter(
        el =>
          el.getAttribute('tabindex') !== '-1' &&
          el.getAttribute('hidden') === null,
      ),
    ];
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    if (event.code === 'Tab') {
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }
  };

  render() {
    const childProps = {
      ...this.props,
      toggleDisplayHidden: this.toggleDisplayHidden,
      toggleDropDown: this.toggleDropDown,
      updateCurrentSection: this.updateCurrentSection,
      linkClicked: this.linkClicked,
      columnThreeLinkClicked: this.columnThreeLinkClicked,
    };

    this.mobileMediaQuery = window.matchMedia('(max-width: 767px)');
    const megaMenuMobileContainer = document.getElementById('mega-menu-mobile');

    if (this.mobileMediaQuery.matches && megaMenuMobileContainer) {
      if (!this.props.display.hidden) {
        document.body.addEventListener('keydown', this.focusTrap);
      } else {
        document.body.removeEventListener('keydown', this.focusTrap);
      }

      return createPortal(
        <MegaMenu {...childProps} />,
        megaMenuMobileContainer,
      );
    }

    return <MegaMenu {...childProps} />;
  }
}

Main.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      menuSections: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      title: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  loggedIn: PropTypes.bool.isRequired,
  toggleMobileDisplayHidden: PropTypes.func.isRequired,
  togglePanelOpen: PropTypes.func.isRequired,
  updateCurrentSection: PropTypes.func.isRequired,
  currentDropdown: PropTypes.string,
  currentSection: PropTypes.string,
  display: PropTypes.object,
  megaMenuData: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      menuSections: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    }).isRequired,
  ),
};

const mapStateToProps = (state, ownProps) => {
  const loggedIn = isLoggedIn(state);

  // Derive the default mega menu links (both auth + unauth).
  const defaultLinks = ownProps?.megaMenuData ? [...ownProps.megaMenuData] : [];

  if (loggedIn) {
    defaultLinks.push(MY_VA_LINK);
  }

  const authenticatedLinks = toggleValues(state)[
    FEATURE_FLAG_NAMES.mhvLandingPageEnabled
  ]
    ? [{ ...MY_HEALTH_LINK }]
    : undefined;

  const data = flagCurrentPageInTopLevelLinks(
    getAuthorizedLinkData(loggedIn, defaultLinks, authenticatedLinks),
  );
  return {
    currentDropdown: state.megaMenu?.currentDropdown,
    currentSection: state.megaMenu?.currentSection,
    data,
    display: state.megaMenu?.display,
    loggedIn,
  };
};

const mapDispatchToProps = {
  toggleMobileDisplayHidden,
  togglePanelOpen,
  updateCurrentSection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
