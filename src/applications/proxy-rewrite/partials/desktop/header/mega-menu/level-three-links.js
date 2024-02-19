// This file is only used for Benefit Hubs links
import { kebabCase } from 'lodash';
import { updateLinkDomain } from '../../../../utilities/links';

export const buildSeeAllLink = seeAllLink => {
  if (seeAllLink) {
    return `
      <div class="panel-bottom-link">
        <a data-e2e-id="${kebabCase(seeAllLink.text)}" href="${updateLinkDomain(
      seeAllLink.href,
    )}">${seeAllLink.text}
          <svg class="all-link-arrow" width="444.819" height="444.819" viewBox="0 0 444.819 444.819">
            <path fill="#004795" d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"></path>
          </svg>
        </a>
      </div>
    `;
  }

  return ``;
};

export const buildLinks = links => {
  if (links.length) {
    return links.map((link, index) => {
      return `
        <li class="mm-link-container">
          <a class="mm-links" data-e2e-id="${kebabCase(
            link.text,
          )}-${index}" href="${updateLinkDomain(link.href)}" target="_self">${
        link.text
      }</a>
        </li>
      `;
    });
  }

  return ``;
};

export const buildImageColumn = (
  column,
  columnClass = '',
  marketingClass = '',
) => {
  const imageSource = updateLinkDomain(column.img.src);

  return `
    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu column-three ${columnClass}" aria-label="columnThree">
      <div class="mm-marketing-container ${marketingClass}">
      <img src="${imageSource}" alt=${column.img.alt}>
        <div class="mm-marketing-text">
          <a class="mm-links" data-e2e-id="${kebabCase(
            column.link.text,
          )}" href="${updateLinkDomain(column.link.href)}" target="_self">${
    column.link.text
  }</a>
          <p>${column.description}</p>
        </div>
      </div>
    </div>
  `;
};

export const buildColumns = (column, columnLabel, columnClass = '') => {
  return `
    <div aria-hidden="false" class="vetnav-panel vetnav-panel--submenu ${columnLabel} ${columnClass}">
      <h3 data-e2e-id="vetnav-${columnLabel}-header" id="vetnav-${columnLabel}-header">${
    column.title
  }</h3>
      <ul id="vetnav-${columnLabel}-col" aria-labelledby="vetnav-${columnLabel}-header">
        <li class="panel-top-link"></li>
        ${column.links && buildLinks(column.links)}
      </ul>
    </div>
  `;
};

// Build hub child links
export const buildLevelThreeLinksForBenefitHubs = section => {
  let seeAllLink = ``;

  if (section.links && section.links.seeAllLink) {
    seeAllLink = buildSeeAllLink(section.links.seeAllLink);
  }

  return `
    ${seeAllLink}
    ${buildColumns(section.links.columnOne, 'column-one')}
    ${buildColumns(section.links.columnTwo, 'column-two')}
    ${buildImageColumn(section.links.columnThree)}
  `;
};

// Build About VA links
export const buildLevelThreeLinksForAboutVA = section => {
  return `
    ${buildColumns(section.mainColumn, 'main-column', 'panel-white')}
    ${buildColumns(section.columnOne, 'column-one', 'panel-white')}
    ${buildColumns(section.columnTwo, 'column-two', 'panel-white')}
    ${buildImageColumn(section.columnThree, 'panel-white', 'mm-marketing-gray')}
  `;
};
