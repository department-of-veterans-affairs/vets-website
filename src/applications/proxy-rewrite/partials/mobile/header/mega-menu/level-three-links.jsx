/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isArray, kebabCase } from 'lodash';
import { updateLinkDomain } from '../../../../utilities/links';
import { keyDownHandler } from '../../../../utilities/keydown';

// Build hub child links
const LevelThreeLinks = ({
  activeMenu,
  menuSections,
  setLevelTwoMenuOpen,
  setLinkShouldFocus,
}) => {
  useEffect(() => {
    const backToMenuButton = document.querySelector('.back-to-menu.active');

    if (backToMenuButton) {
      backToMenuButton.focus();
    }
  });

  const backToMenuClick = () => {
    setLevelTwoMenuOpen(null);
    setLinkShouldFocus(true);
  };

  const formatMenuItems = menuItems => {
    const formattedMenuItems = [];

    if (menuItems && isArray(menuItems)) {
      return menuItems;
    }

    if (menuItems?.seeAllLink) {
      formattedMenuItems.push({
        title: menuItems?.seeAllLink?.text,
        href: menuItems?.seeAllLink?.href,
      });
    }

    if (menuItems?.mainColumn) {
      formattedMenuItems.push({
        title: menuItems?.mainColumn?.title,
        links: menuItems?.mainColumn?.links,
      });
    }

    if (menuItems?.columnOne) {
      formattedMenuItems.push({
        title: menuItems?.columnOne?.title,
        links: menuItems?.columnOne?.links,
      });
    }

    if (menuItems?.columnTwo) {
      formattedMenuItems.push({
        title: menuItems?.columnTwo?.title,
        links: menuItems?.columnTwo?.links,
      });
    }

    return formattedMenuItems;
  };

  const buildLinks = linkGroups => {
    const linkHtml = (text, href) => {
      return (
        <li
          className="vads-u-background-color--primary-dark vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          key={text}
        >
          <a
            className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full"
            href={updateLinkDomain(href)}
          >
            {text}
          </a>
        </li>
      );
    };

    return linkGroups.map(group => {
      if (group.links) {
        return group.links.map(link => linkHtml(link.text, link.href));
      }
      if (Array.isArray(group)) {
        return group.map(link => linkHtml(link.text, link.href));
      }
      return linkHtml(group.text || group.title, group.href);
    });
  };

  const containerForLinks = (title, linkGroups) => {
    const isActiveMenu = activeMenu === title;

    return (
      <div
        id={title}
        key={kebabCase(title)}
        hidden={!isActiveMenu}
        className="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full"
      >
        <ul className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">
          <li className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
            <button
              className={classNames(
                'back-to-menu header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center',
                { active: isActiveMenu },
              )}
              type="button"
              onClick={backToMenuClick}
              onKeyDown={event => keyDownHandler(event, backToMenuClick)}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="8 5 13 13"
                width="17"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#005ea2"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14 6L15.41 7.41L10.83 12L15.41 16.59L14 18L8.00003 12L14 6Z"
                />
              </svg>
              Back to menu
            </button>
          </li>
          {buildLinks(linkGroups)}
        </ul>
      </div>
    );
  };

  const linkContainers = [];

  if (!menuSections) {
    return null;
  }

  if (Array.isArray(menuSections)) {
    // Benefit hubs
    for (const section of menuSections) {
      if (section.links) {
        linkContainers.push(
          containerForLinks(section.title, formatMenuItems(section.links)),
        );
      }
    }
  } else {
    // About VA
    const linkGroups = formatMenuItems(menuSections);

    linkGroups.forEach(group => {
      linkContainers.push(containerForLinks(group.title, group.links));
    });

    return linkContainers;
  }

  return linkContainers;
};

LevelThreeLinks.propTypes = {
  activeMenu: PropTypes.string,
  menuSections: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  setLevelTwoMenuOpen: PropTypes.func,
};

export default LevelThreeLinks;
