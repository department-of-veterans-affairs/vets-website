import React from 'react';
import { kebabCase } from 'lodash';
import {
  buildLevelThreeLinksForAboutVA,
  buildLevelThreeLinksForBenefitHubs,
} from './level-three-links';
import { updateLinkDomain } from '../../../../utilities/links';

// Build nested children (e.g. Hub links, About VA child links)
export const buildLevelTwoLinks = sectionData => {
  if (Array.isArray(sectionData)) {
    return sectionData.map((section, index) => {
      const { links, title } = section;

      if (links) {
        return (
          <li className="mm-link-container" key={index}>
            <button
              aria-expanded="false"
              className="vetnav-level2"
              aria-controls={`vetnav-${kebabCase(title)}-ms`}
            >
              {title}
            </button>
            <div id={`vetnav-${kebabCase(title)}-ms`} role="group" hidden>
              <button
                className="back-button"
                aria-controls={`vetnav-${kebabCase(title)}`}
              >
                Back to Menu
              </button>
              {buildLevelThreeLinksForBenefitHubs(section)}
            </div>
          </li>
        );
      }

      return (
        <li className="mm-link-container" key={index}>
          <a
            className="vetnav-level2"
            data-e2e-id={`vetnav-level2--${kebabCase(title)}`}
            href={updateLinkDomain(section.href)}
          >
            {section.text}
          </a>
        </li>
      );
    });
  }

  return buildLevelThreeLinksForAboutVA(sectionData);
};
