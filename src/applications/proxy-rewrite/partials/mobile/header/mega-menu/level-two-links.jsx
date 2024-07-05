/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import { updateLinkDomain } from '../../../../utilities/links';

const LevelTwoLinks = ({ sectionData, setLevelTwoMenuOpen }) => {
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

  const onButtonClick = index => {
    setLevelTwoMenuOpen(index);
  };

  if (Array.isArray(sectionData)) {
    return sectionData.map((section, index) => {
      const { links, title } = section;
      const menuTitle = `${kebabCase(title)}-menu`;

      if (links) {
        return (
          <li
            className="vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
            data-e2e-id={title}
            key={index}
          >
            <button
              data-menu={menuTitle}
              className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
              data-e2e-id={`${title}--2`}
              id={`${title}--2`}
              onClick={() => onButtonClick(menuTitle)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onButtonClick(menuTitle);
                }
              }}
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
          data-e2e-id={kebabCase(title)}
          key={index}
        >
          <a className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-width--full"
          data-e2e-id={kebabCase(title.toLowerCase())}
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
    
    const mainTitleData = `${kebabCase(mainTitle)}-menu`;
    const oneTitleData = `${kebabCase(oneTitle)}-menu`;
    const twoTitleData = `${kebabCase(twoTitle)}-menu`;

    return (
      <>
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          data-e2e-id={mainTitle}
        >
          <button
            data-menu={mainTitleData}
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
            data-e2e-id={`${mainTitle}--2`}
            id={`${mainTitle}--2`}
            type="button"
            onClick={() => onButtonClick(mainTitleData)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onButtonClick(mainTitleData);
              }
            }}
          >
            {mainTitle}
            {rightChevron}
          </button>
        </li>
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          data-e2e-id={oneTitle}
        >
          <button
            data-menu={oneTitleData}
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
            data-e2e-id={`${oneTitle}--2`}
            id={`${oneTitle}--2`}
            type="button"
            onClick={() => onButtonClick(oneTitleData)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onButtonClick(oneTitleData);
              }
            }}
          >
            {oneTitle}
            {rightChevron}
          </button>
        </li>
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          data-e2e-id={twoTitle}
        >
          <button
            data-menu={twoTitleData}
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
            data-e2e-id={`${twoTitle}--2`}
            id={`${twoTitle}--2`}
            type="button"
            onClick={() => onButtonClick(twoTitleData)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onButtonClick(twoTitleData);
              }
            }}
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
  levelOneIndexOpen: PropTypes.number,
  sectionData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default LevelTwoLinks;