/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

const fragments = require('./fragments.graphql');

const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');

const WYSIWYG = '... wysiwyg';
const STAFF = '... staffProfile';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const QA = '... qa';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const REACT_WIDGET = '... reactWidget';
const NUMBER_CALLOUT = '... numberCallout';
const TABLE = '... table';
const ALERT_PARAGRAPH = '... alertParagraph';
const DOWNLOADABLE_FILE_PARAGRAPH = '... downloadableFile';
const MEDIA_PARAGRAPH = '... embeddedImage';
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const { generatePaginatedQueries } = require('../individual-queries-helpers');

const healthCareRegionDetailPage = `
  fragment healthCareRegionDetailPage on NodeHealthCareRegionDetailPage {
    title
    ${entityElementsFromPages}
    entityBundle
    changed
    fieldIntroText
    fieldTableOfContentsBoolean
    fieldFeaturedContent {
      entity {
        entityType
        entityBundle
        ${WYSIWYG}
        ${QA}
      }
    }
    fieldContentBlock {
      entity {
        entityType
        entityBundle
        ${STAFF}
        ${WYSIWYG}
        ${COLLAPSIBLE_PANEL}
        ${PROCESS}
        ${QA_SECTION}
        ${QA}
        ${LIST_OF_LINK_TEASERS}
        ${REACT_WIDGET}
        ${NUMBER_CALLOUT}
        ${TABLE}
        ${ALERT_PARAGRAPH}
        ${DOWNLOADABLE_FILE_PARAGRAPH}
        ${MEDIA_PARAGRAPH}
      }
    }
    ${FIELD_RELATED_LINKS}
    ${FIELD_ALERT}
    fieldOffice {
      entity {
        ...on NodeHealthCareRegionPage {
          entityLabel
          title
        }
      }
    }
  }
`;

function getNodeHealthCareRegionDetailPageSlice(operationName, offset, limit) {
  return `
    ${fragments.wysiwyg}
    ${fragments.staffProfile}
    ${fragments.collapsiblePanel}
    ${fragments.process}
    ${fragments.qaSection}
    ${fragments.qa}
    ${fragments.listOfLinkTeasers}
    ${fragments.reactWidget}
    ${fragments.numberCallout}
    ${fragments.table}
    ${fragments.alertParagraph}
    ${fragments.downloadableFile}
    ${fragments.embeddedImage}
    ${fragments.linkTeaser}
    ${fragments.alert}

    ${healthCareRegionDetailPage}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
        filter: {
          conditions: [
            { field: "status", value: ["1"], enabled: $onlyPublishedContent },
            { field: "type", value: ["health_care_region_detail_page"] }
          ]
      }) {
        entities {
          ... healthCareRegionDetailPage
        }
      }
    }
  `;
}

function getNodeHealthCareRegionDetailPageQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodeHealthCareRegionDetailPage',
    entitiesPerSlice: 50,
    totalEntities: entityCounts.data.healthCareRegionDetailPage.count,
    getSlice: getNodeHealthCareRegionDetailPageSlice,
  });
}

module.exports = {
  fragment: healthCareRegionDetailPage,
  getNodeHealthCareRegionDetailPageQueries,
};
