import { kebabCase } from 'lodash';
import {
  buildLevelThreeLinksForAboutVA,
  buildLevelThreeLinksForBenefitHubs,
} from './level-three-links';
import { updateLinkDomain } from '../../../../utilities/links';

// Build nested children (e.g. Hub links, About VA child links)
export const buildLevelTwoLinks = sectionData => {
  if (Array.isArray(sectionData)) {
    return sectionData.map(section => {
      const { links, title } = section;

      if (links) {
        return `
          <li class="mm-link-container">
            <button
              aria-expanded="false"
              class="vetnav-level2"
              aria-controls="vetnav-${kebabCase(title)}-ms"
              aria-haspopup="true"
            >
              ${title}
            </button>
            <div id="vetnav-${kebabCase(title)}-ms" role="group" hidden>
              <button class="back-button" aria-controls="vetnav-${kebabCase(
                title,
              )}">Back to Menu</button>
              ${buildLevelThreeLinksForBenefitHubs(section)}
            </div>
          </li>
        `;
      }

      return `
        <li class="mm-link-container">
          <a class="vetnav-level2" data-e2e-id="vetnav-level2--${kebabCase(
            title,
          )}" href="${updateLinkDomain(section.href)}">${section.text}</a>
        </li>
      `;
    });
  }

  return buildLevelThreeLinksForAboutVA(sectionData);
};
