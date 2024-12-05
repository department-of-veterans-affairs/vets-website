/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';
import { updateLinkDomain } from '../../../../utilities/links';
import { keyDownHandler } from '../../../../utilities/keydown';

const LevelTwoLinks = ({
  sectionData,
  setLevelTwoMenuOpen,
  setLinkShouldFocus,
  setPreviouslyClickedMenu,
}) => {
  if (!sectionData) {
    return null;
  }

  const rightChevron = (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="-1 2 17 17"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#005ea2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"
      />
    </svg>
  );

  const onButtonClick = title => {
    setLevelTwoMenuOpen(title);
    setPreviouslyClickedMenu(title);
    setLinkShouldFocus(false);
  };

  if (Array.isArray(sectionData)) {
    return sectionData.map((section, index) => {
      const { links, title } = section;

      if (links) {
        return (
          <li
            className="vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
            id={title}
            key={index}
          >
            <button
              className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default"
              id={`${title}--2`}
              onClick={() => onButtonClick(title)}
              onKeyDown={event => keyDownHandler(event, onButtonClick, title)}
              type="button"
            >
              {title}
              {rightChevron}
            </button>
          </li>
        );
      }

      return (
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          id={title}
          key={index}
        >
          <a
            className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-width--full"
            href={updateLinkDomain(section.href)}
          >
            {title}
          </a>
        </li>
      );
    });
  }

  if (sectionData.mainColumn) {
    const mainTitle = sectionData.mainColumn.title;
    const oneTitle = sectionData.columnOne.title;
    const twoTitle = sectionData.columnTwo.title;

    return (
      <>
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          id={mainTitle}
        >
          <button
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default"
            id={`${mainTitle}--2`}
            type="button"
            onClick={() => onButtonClick(mainTitle)}
            onKeyDown={event => keyDownHandler(event, onButtonClick, mainTitle)}
          >
            {mainTitle}
            {rightChevron}
          </button>
        </li>
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          id={oneTitle}
        >
          <button
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default"
            id={`${oneTitle}--2`}
            type="button"
            onClick={() => onButtonClick(oneTitle)}
            onKeyDown={event => keyDownHandler(event, onButtonClick, oneTitle)}
          >
            {oneTitle}
            {rightChevron}
          </button>
        </li>
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          id={twoTitle}
        >
          <button
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default"
            id={`${twoTitle}--2`}
            type="button"
            onClick={() => onButtonClick(twoTitle)}
            onKeyDown={event => keyDownHandler(event, onButtonClick, twoTitle)}
          >
            {twoTitle}
            {rightChevron}
          </button>
        </li>
      </>
    );
  }

  return null;
};

LevelTwoLinks.propTypes = {
  setLevelTwoMenuOpen: PropTypes.func.isRequired,
  setLinkShouldFocus: PropTypes.func.isRequired,
  setPreviouslyClickedMenu: PropTypes.func.isRequired,
  sectionData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default LevelTwoLinks;
