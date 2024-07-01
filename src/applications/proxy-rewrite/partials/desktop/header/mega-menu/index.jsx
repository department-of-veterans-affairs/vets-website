import React from 'react';
import { kebabCase } from 'lodash';
import { buildLevelTwoLinks } from './level-two-links';
import { updateLinkDomain } from '../../../../utilities/links';

// Build top titles (e.g. VA Benefits and Health Care, About VA)
export const buildLevelOneLinks = (sectionData, index) => {
  const isDropdown = sectionData.menuSections;

  if (isDropdown) {
    return (
      <li key={index}>
        <button
          type="button"
          aria-expanded="false"
          aria-controls={`vetnav-${kebabCase(sectionData.title)}`}
          className="vetnav-level1"
          data-e2e-id={`${kebabCase(sectionData.title)}-${index}`}
        >
          {sectionData.title}
        </button>
        <div
          id={`vetnav-${kebabCase(sectionData.title)}`}
          className="vetnav-panel" 
          hidden
        >
          <ul aria-label={sectionData.title}>
            {buildLevelTwoLinks(sectionData.menuSections)}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li key={index}>
      <a
        className="vetnav-level1 medium-screen:vads-u-padding--2"
        data-e2e-id={`${kebabCase(sectionData.title)}-${index}`}
        href={updateLinkDomain(sectionData.href)}
      >
        {sectionData.title}
      </a>
    </li>
  );
};

const MegaMenu = ({ megaMenuData }) => {
  return (
    <div className="usa-grid usa-grid-full">
      <div className="menu-rule"></div>
      <div id="mega-menu">
        <div className="hidden-header login-container">
          <div className="row vads-u-display--flex">
            <div id="vetnav" role="navigation">
              <ul id="vetnav-menu">
                <li>
                  <a
                    className="vetnav-level1"
                    data-testid="mobile-home-nav-link"
                    href="https://www.va.gov"
                  >
                    Home
                  </a>
                </li>
                {megaMenuData.map((section, index) => buildLevelOneLinks(section, index))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
