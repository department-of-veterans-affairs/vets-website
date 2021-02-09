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

function getNodeHealthCareRegionDetailPageSlice(
  operationName,
  offset,
  limit = 100,
) {
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
        sort: { field: "changed", direction:  ASC }
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

module.exports = {
  fragment: healthCareRegionDetailPage,
  HealthCareRegionDetailPageSlices: {
    GetNodeHealthCareRegionDetailPageSlice1: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice1',
      0,
    ),
    GetNodeHealthCareRegionDetailPageSlice2: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice2',
      100,
    ),
    GetNodeHealthCareRegionDetailPageSlice3: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice3',
      200,
    ),
    GetNodeHealthCareRegionDetailPageSlice4: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice4',
      300,
    ),
    GetNodeHealthCareRegionDetailPageSlice5: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice5',
      400,
    ),
    GetNodeHealthCareRegionDetailPageSlice6: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice6',
      500,
    ),
    GetNodeHealthCareRegionDetailPageSlice7: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice7',
      600,
    ),
    GetNodeHealthCareRegionDetailPageSlice8: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice8',
      700,
    ),
    GetNodeHealthCareRegionDetailPageSlice9: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice9',
      800,
    ),
    GetNodeHealthCareRegionDetailPageSlice10: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice10',
      900,
    ),
    GetNodeHealthCareRegionDetailPageSlice11: getNodeHealthCareRegionDetailPageSlice(
      'GetNodeHealthCareRegionDetailPageSlice11',
      1000,
      9999,
    ),
  },
};
