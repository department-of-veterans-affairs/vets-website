import { kebabCase } from 'lodash';
import { buildLevelTwoLinks } from './level-two-links';
import { updateLinkDomain } from '../../../../utilities/links';

// Build top titles (e.g. VA Benefits and Health Care, About VA)
export const buildLevelOneLinks = (sectionData, index) => {
  const isDropdown = sectionData.menuSections;

  if (isDropdown) {
    return `
      <li>
        <button
          type="button"
          aria-expanded="false"
          aria-controls="vetnav-${kebabCase(sectionData.title)}"
          aria-haspopup="true"
          class="vetnav-level1"
          data-e2e-id="${kebabCase(sectionData.title)}-${index}"
        >
          ${sectionData.title}
        </button>
        <div
          id="vetnav-${kebabCase(sectionData.title)}"
          class="vetnav-panel" 
          hidden
        >
          <ul aria-label="${sectionData.title}">
            ${buildLevelTwoLinks(sectionData.menuSections)}
          </ul>
        </div>
      </li>
    `;
  }

  return `
    <li>
      <a class="vetnav-level1 medium-screen:vads-u-padding--2" data-e2e-id="${kebabCase(
        sectionData.title,
      )}-${index}" href="${updateLinkDomain(sectionData.href)}">${
    sectionData.title
  }</a>
    </li>
  `;
};

export const makeMegaMenu = megaMenuData => {
  return `
    <div class="usa-grid usa-grid-full">
      <div class="menu-rule usa-one-whole"></div>
      <div id="mega-menu">
        <div class="hidden-header login-container">
          <div class="row va-flex">
            <div id="vetnav" role="navigation">
              <ul id="vetnav-menu">
                <li>
                  <a
                    class="vetnav-level1"
                    data-testid="mobile-home-nav-link"
                    href="https://va.gov"
                  >
                    Home
                  </a>
                </li>
                ${megaMenuData
                  .map((section, index) => buildLevelOneLinks(section, index))
                  .join()
                  .replaceAll(',', '')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
