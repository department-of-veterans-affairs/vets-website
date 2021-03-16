const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');

const { generatePaginatedQueries } = require('../individual-queries-helpers');

const pageFragment = `

  fragment page on NodePage {
    ${entityElementsFromPages}
    fieldIntroTextLimitedHtml {
      processed
    }
    fieldDescription
    fieldTableOfContentsBoolean
    fieldFeaturedContent {
      entity {
        entityType
        entityBundle
        ... wysiwyg
        ... qa
      }
    }
    fieldContentBlock {
      entity {
        entityType
        entityBundle
        ... wysiwyg
        ... collapsiblePanel
        ... process
        ... qaSection
        ... qa
        ... listOfLinkTeasers
        ... reactWidget
        ... spanishSummary
        ... alertParagraph
        ... table
        ... downloadableFile
        ... embeddedImage
        ... numberCallout
      }
    }
    ${FIELD_ALERT}
    ${FIELD_RELATED_LINKS}
    fieldAdministration {
      ... on FieldNodePageFieldAdministration {
        entity {
          ... on TaxonomyTermAdministration {
            name
          }
        }
      }
    }
    fieldPageLastBuilt {
      date
    }
    changed
  }
`;

function getPageNodeSlice(operationName, offset, limit) {
  return `
    ${fragments.linkTeaser}
    ${fragments.alert}
    ${fragments.wysiwyg}
    ${fragments.collapsiblePanel}
    ${fragments.process}
    ${fragments.qaSection}
    ${fragments.qa}
    ${fragments.listOfLinkTeasers}
    ${fragments.reactWidget}
    ${fragments.spanishSummary}
    ${fragments.alertParagraph}
    ${fragments.table}
    ${fragments.downloadableFile}
    ${fragments.embeddedImage}
    ${fragments.numberCallout}

    ${pageFragment}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
        filter: {
          conditions: [
            { field: "status", value: ["1"], enabled: $onlyPublishedContent },
            { field: "type", value: ["page"] }
          ]
      }) {
        entities {
          ... page
        }
      }
    }
`;
}

function getNodePageQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodePage',
    entitiesPerSlice: 25,
    totalEntities: entityCounts.data.benefitPages.count,
    getSlice: getPageNodeSlice,
  });
}

module.exports = {
  fragment: pageFragment,
  getNodePageQueries,
};
