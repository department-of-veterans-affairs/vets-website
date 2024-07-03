/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import { kebabCase } from 'lodash';
import { updateLinkDomain } from '../../../../utilities/links';

export const buildLevelTwoLinks = sectionData => {
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

  if (Array.isArray(sectionData)) {
    return sectionData.map((section, index) => {
      const { links, title } = section;

      if (links) {
        return (
          <li
            className="vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
            data-e2e-id={title}
            key={index}
          >
            <button
              data-menu={`${kebabCase(title)}-menu`}
              className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
              data-e2e-id={`${title}--2`}
              id={`${title}--2`}
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

    return (
      <>
        <li
          className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
          data-e2e-id={mainTitle}
        >
          <button
            data-menu={`${kebabCase(mainTitle)}-menu`}
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
            data-e2e-id={`${mainTitle}--2`}
            id={`${mainTitle}--2`}
            type="button"
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
            data-menu={`${kebabCase(oneTitle)}-menu`}
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
            data-e2e-id={`${oneTitle}--2`}
            id={`${oneTitle}--2`}
            type="button"
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
            data-menu={`${kebabCase(twoTitle)}-menu`}
            className="header-menu-item-button level2 vads-u-background-color--gray-lightest vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default" 
            data-e2e-id={`${twoTitle}--2`}
            id={`${twoTitle}--2`}
            type="button"
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
