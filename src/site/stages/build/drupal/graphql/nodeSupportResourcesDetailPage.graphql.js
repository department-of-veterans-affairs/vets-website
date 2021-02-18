const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const nodeSupportResourcesDetailPage = `
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
  fieldContactInformation {
    entity {
      entityBundle
      ... contactInformation
    }
  }
  fieldRelatedBenefitHubs {
    entity {
      ... on NodeLandingPage {
        fieldHomePageHubLabel
        fieldTeaserText
        path {
          alias
        }
        fieldSupportServices {
          entity {
            ... supportService
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
  fieldPrimaryCategory {
    entity {
      ... taxonomyTermLcCategories
    }
  }
  fieldOtherCategories {
    entity {
      ... taxonomyTermLcCategories
    }
  }
  fieldTags {
    entity {
      ... audienceTopics
    }
  }
}
`;

const GetNodeSupportResourcesDetailPage = `

  ${fragments.linkTeaser}
  ${fragments.alertParagraphSingle}
  ${fragments.button}
  ${fragments.contactInformation}
  ${fragments.supportService}
  ${fragments.termTopics}
  ${fragments.termLcCategory}
  ${fragments.audienceTopics}
  ${fragments.emailContact}
  ${fragments.phoneNumber}
  ${fragments.audienceBeneficiaries}
  ${fragments.audienceNonBeneficiaries}
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

  ${nodeSupportResourcesDetailPage}

  query GetNodeSupportResourcesDetailPage($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 100, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["support_resources_detail_page"] }
      ]
    }) {
      entities {
        ... nodeSupportResourcesDetailPage
      }
    }
  }
`;
module.exports = {
  fragment: nodeSupportResourcesDetailPage,
  GetNodeSupportResourcesDetailPage,
};
