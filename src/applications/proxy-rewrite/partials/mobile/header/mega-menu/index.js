import { buildLevelTwoLinks } from './level-two-links';
import { buildLevelThreeLinks } from './level-three-links';

export const makeMegaMenu = megaMenuData => {
  const levelThreeLinks = data => {
    return data.map(section => {
      if (section.menuSections) {
        return buildLevelThreeLinks(section.menuSections);
      }

      return ``;
    });
  };

  const buildLevelOneLinks = (sectionData, index) => {
    if (sectionData.menuSections) {
      return `
        <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
          <button aria-expanded="false" class="header-menu-item-button level1 vads-u-background-color--primary-darker vads-u-display--flex vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white" data-e2e-id="${
            sectionData.title
          }--${index + 1}" id="${sectionData.title}--${index +
        1}" type="button">${sectionData.title}
            <svg
              aria-hidden="true"
              class="mobile-benhub"
              focusable="false"
              viewBox="0 2 20 20"
              width="20"
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
              class="mobile-benhub"
              focusable="false"
              hidden
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
        <ul hidden aria-label="${
          sectionData.title
        }" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0" id="${
        sectionData.title
      }--${index + 1}">
          ${buildLevelTwoLinks(sectionData.menuSections)}
        </ul>
      `;
    }

    return `
    <li class="vads-u-font-size--base vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
      <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/find-locations">
        Find a VA Location
      </a>
    </li>
    `;
  };

  return `
    <div id="mobile-mega-menu" class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full" hidden>
      <label class="vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-left--1p5">Search</label>
      <div>
        <div id="mobile-search-container"></div>
        <ul id="header-nav-items" class="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
          ${megaMenuData
            .map((section, index) => buildLevelOneLinks(section, index))
            .join()
            .replaceAll(',', '')}
          <li class="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold vads-u-font-size--md">
            <a class="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full" href="https://www.va.gov/contact-us/">Contact us</a>
          </li>
        </ul>
      </div>
      ${levelThreeLinks(megaMenuData)
        .join()
        .replaceAll(',', '')}
    </div>   
  `;
};
