const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const nodeBasicLandingPage = `
fragment nodeBasicLandingPage on NodeBasicLandingPage {
  ${entityElementsFromPages}
  title
  changed
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
      ... listsOfLinks
    }
  }
  fieldDescription
  fieldIntroTextLimitedHtml {
    value
    format
    processed
  }
  fieldMetaTitle
  fieldProduct {
    entity {
      entityBundle
      ... on TaxonomyTermProducts {
        name
      }
    }
  }
  fieldTableOfContentsBoolean
}
`;

const GetNodeBasicLandingPage = `

  ${fragments.linkTeaser}
  ${fragments.listOfLinkTeasers}
  ${fragments.listsOfLinks}
  ${fragments.wysiwyg}
  ${fragments.collapsiblePanel}
  ${fragments.process}
  ${fragments.qaSection}
  ${fragments.qa}
  ${fragments.reactWidget}
  ${fragments.spanishSummary}
  ${fragments.alertParagraph}
  ${fragments.table}
  ${fragments.downloadableFile}
  ${fragments.embeddedImage}
  ${fragments.numberCallout}

  ${nodeBasicLandingPage}

  query GetNodeBasicLandingPage($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 100, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["basic_landing_page"] }
      ]
    }) {
      entities {
        ... nodeBasicLandingPage
      }
    }
  }
`;
module.exports = {
  fragment: nodeBasicLandingPage,
  GetNodeBasicLandingPage,
};
