const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeSupportResourcesDetailPage on NodeSupportResourcesDetailPage {
  ${entityElementsFromPages}
  entityBundle
  changed
  title

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
  fieldTableOfContentsBoolean
  fieldIntroTextLimitedHtml {
    processed
  }
  fieldAlertSingle {
    entity {
      ... alertSingle
    }
  }
  fieldButtonsRepeat
  fieldButtons {
    entity {
      ... button
    }
  }
  fieldRelatedBenefitHubs {
    entity {
      ... on NodeLandingPage {
        fieldSupportServices {
          entity {
            ... on NodeSupportService {
              title
              fieldLink {
                title
                url {
                  path
                  routed
                }
              }
              fieldPhoneNumber
            }
          }
        }
      }
    }
  }
  fieldRelatedInformation {
    entity {
      ... linkTeaser
    }
  }
}
`;

module.exports = fragment;
