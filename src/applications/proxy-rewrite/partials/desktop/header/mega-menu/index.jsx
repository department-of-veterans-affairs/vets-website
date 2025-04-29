/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import classNames from 'classnames';
import LevelTwoLinks from './level-two-links';
import { updateLinkDomain } from '../../../../utilities/links';
import { keyDownHandler } from '../../../../utilities/keydown';

const MegaMenu = ({ megaMenuData }) => {
  const [levelOneIndexOpen, setLevelOneIndexOpen] = useState(null);
  const [levelTwoIndexOpen, setLevelTwoIndexOpen] = useState(null);

  const clearMenu = () => {
    setLevelOneIndexOpen(null);
    setLevelTwoIndexOpen(null);
  };

  useEffect(() => {
    const megaNavContainer = document.getElementsByClassName(
      'mega-nav-open',
    )?.[0];
    const htmlElement = document.getElementsByTagName('html')[0];

    const outsideClickHandler = event => {
      if (!megaNavContainer.contains(event.target)) {
        clearMenu();
      }
    };

    if (megaNavContainer) {
      htmlElement.addEventListener('click', outsideClickHandler);
    }

    return () => {
      htmlElement.removeEventListener('click', outsideClickHandler);
    };
  });

  const toggleLevelOne = index => {
    // i.e. the click was meant to close the menu
    const menuIsAlreadyOpen = index === levelOneIndexOpen;

    setLevelOneIndexOpen(menuIsAlreadyOpen ? null : index);

    if (menuIsAlreadyOpen) {
      clearMenu();
    }
  };

  // Build top titles (e.g. VA Benefits and Health Care, About VA)
  const buildLevelOneLinks = (sectionData, index) => {
    const isDropdown = sectionData?.menuSections;
    const sectionOpen = levelOneIndexOpen === index;

    if (isDropdown) {
      return (
        <li key={index}>
          <button
            type="button"
            aria-expanded={sectionOpen}
            aria-controls={`vetnav-${kebabCase(sectionData.title)}`}
            className="vetnav-level1"
            onClick={() => {
              toggleLevelOne(index);
            }}
            onKeyDown={event => keyDownHandler(event, toggleLevelOne, index)}
          >
            {sectionData.title}
          </button>
          <div
            id={`vetnav-${kebabCase(sectionData.title)}`}
            className={classNames('vetnav-panel', {
              'vetnav-submenu--expanded': levelTwoIndexOpen !== null,
            })}
            hidden={!sectionOpen}
          >
            <ul aria-label={sectionData.title}>
              <LevelTwoLinks
                levelTwoIndexOpen={levelTwoIndexOpen}
                sectionData={sectionData.menuSections}
                setLevelTwoIndexOpen={setLevelTwoIndexOpen}
              />
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={index}>
        <a
          className="vetnav-level1 medium-screen:vads-u-padding--2"
          href={updateLinkDomain(sectionData.href)}
        >
          {sectionData.title}
        </a>
      </li>
    );
  };

  return (
    <div className="usa-grid usa-grid-full">
      <div className="menu-rule" />
      <div id="mega-menu">
        <div className="login-container">
          <div className="row vads-u-display--flex">
            <div id="vetnav" role="navigation">
              <ul
                id="vetnav-menu"
                className={classNames({
                  'mega-nav-open': levelOneIndexOpen !== null,
                })}
              >
                <li>
                  <a
                    className="vetnav-level1"
                    data-testid="mobile-home-nav-link"
                    href="https://www.va.gov"
                  >
                    Home
                  </a>
                </li>
                {megaMenuData.map((section, index) =>
                  buildLevelOneLinks(section, index),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MegaMenu.propTypes = {
  megaMenuData: PropTypes.array.isRequired,
};

export default MegaMenu;
