/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LevelTwoLinks from './level-two-links';
import LevelThreeLinks from './level-three-links';
import { keyDownHandler } from '../../../../utilities/keydown';
import Search from '../../../search';

const MegaMenu = ({ isDesktop, megaMenuData, menuIsOpen }) => {
  const [levelOneIndexOpen, setLevelOneIndexOpen] = useState(null);
  const [levelTwoMenuOpen, setLevelTwoMenuOpen] = useState(null);
  const [previouslyClickedMenu, setPreviouslyClickedMenu] = useState(null);
  const [linkShouldFocus, setLinkShouldFocus] = useState(false);

  const focus = document.querySelector('[data-menu="Health care"]');

  focus?.focus();

  useEffect(() => {
    if (previouslyClickedMenu && linkShouldFocus) {
      const menu = document.querySelector(`[data-menu="${previouslyClickedMenu}"]`);
      console.log('focusing menu');
      menu.focus();
    }
  }, [previouslyClickedMenu, linkShouldFocus]);

  useEffect(
    () => {
      const search = document.getElementById('search');

      if (levelTwoMenuOpen !== null && search) {
        search.setAttribute('hidden', true);
      } else {
        search.removeAttribute('hidden');
      }
    },
    [levelTwoMenuOpen],
  );

  const openLevelOne = index => {
    setLevelOneIndexOpen(index === levelOneIndexOpen ? null : index);
  };

  const buildLevelOneLinks = (sectionData, index) => {
    if (sectionData.menuSections) {
      return (
        <Fragment key={index}>
          <li className="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
            <button
              aria-expanded={levelOneIndexOpen === index}
              className="header-menu-item-button level1 vads-u-background-color--primary-darker vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white"
              id={`${sectionData.title}--${index + 1}`}
              type="button"
              onClick={() => openLevelOne(index)}
              onKeyDown={event => keyDownHandler(event, openLevelOne, index)}
            >
              {sectionData.title}
              <svg
                aria-hidden="true"
                className="mobile-benhub"
                focusable="false"
                viewBox="0 2 20 20"
                width="20"
                hidden={levelOneIndexOpen === index}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                />
              </svg>
              <svg
                aria-hidden="true"
                className="mobile-benhub"
                focusable="false"
                hidden={levelOneIndexOpen !== index}
                viewBox="0 2 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19 13H5V11H19V13Z"
                />
              </svg>
            </button>
          </li>
          <ul
            hidden={levelOneIndexOpen !== index}
            aria-label={sectionData.title}
            className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0"
            id={`${sectionData.title}--${index + 1}`}
          >
            <LevelTwoLinks
              setPreviouslyClickedMenu={setPreviouslyClickedMenu}
              sectionData={sectionData.menuSections}
              setLevelTwoMenuOpen={setLevelTwoMenuOpen}
            />
          </ul>
        </Fragment>
      );
    }

    return (
      <li
        className="vads-u-font-size--base vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
        key={index}
      >
        <a
          className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full"
          href="https://www.va.gov/find-locations"
        >
          Find a VA Location
        </a>
      </li>
    );
  };

  return (
    <div
      id="mobile-mega-menu"
      className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full"
      hidden={!menuIsOpen}
    >
      <div>
        <div id="search">
          <Search isDesktop={isDesktop} />
        </div>
        <ul
          id="header-nav-items"
          className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0"
          hidden={levelTwoMenuOpen !== null}
        >
          {megaMenuData.map((section, index) =>
            buildLevelOneLinks(section, index),
          )}
          <li className="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold vads-u-font-size--md">
            <a
              className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full"
              href="https://www.va.gov/contact-us/"
            >
              Contact us
            </a>
          </li>
        </ul>
      </div>
      {megaMenuData.map((section, index) => (
        <LevelThreeLinks
          activeMenu={levelTwoMenuOpen}
          key={index}
          menuSections={section.menuSections}
          setLevelTwoMenuOpen={setLevelTwoMenuOpen}
          setLinkShouldFocus={setLinkShouldFocus}
        />
      ))}
    </div>
  );
};

MegaMenu.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  megaMenuData: PropTypes.array.isRequired,
  menuIsOpen: PropTypes.bool.isRequired,
};

export default MegaMenu;
