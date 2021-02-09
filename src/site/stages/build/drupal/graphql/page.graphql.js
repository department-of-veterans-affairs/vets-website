const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');

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

function getPageNodeSlice(operationName, offset, limit = 100) {
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
        sort: { field: "changed", direction:  ASC }
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

module.exports = {
  fragment: pageFragment,
  NodePageSlices: {
    GetNodePagesSlice1: getPageNodeSlice('GetNodePagesSlice1', 0),
    GetNodePagesSlice2: getPageNodeSlice('GetNodePagesSlice2', 100),
    GetNodePagesSlice3: getPageNodeSlice('GetNodePagesSlice3', 200),
    GetNodePagesSlice4: getPageNodeSlice('GetNodePagesSlice4', 300, 9999),
  },
};
