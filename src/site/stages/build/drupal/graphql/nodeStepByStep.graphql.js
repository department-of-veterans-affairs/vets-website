const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const nodeStepByStep = `
fragment nodeStepByStep on NodeStepByStep {
  ${entityElementsFromPages}
  entityBundle

  changed
  title
  fieldIntroTextLimitedHtml {
    processed
  }
  fieldAlertSingle {
    entity {
      ... alertSingle
    }
  }
  fieldButtons {
    entity {
      ... button
    }
  }
  fieldButtonsRepeat
  fieldSteps {
    entity {
      ... on ParagraphStepByStep {
        fieldSectionHeader
        fieldStep {
          entity {
            ... on ParagraphStep {
              fieldWysiwyg {
                processed
              }
              fieldAlert {
                entity {
                  ... alertSingle
                }
              }
              fieldMedia {
                entity {
                  ... on Media {
                    thumbnail {
                      alt
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
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

const GetNodeStepByStep = `
  ${fragments.alertParagraphSingle}
  ${fragments.button}
  ${fragments.contactInformation}
  ${fragments.supportService}
  ${fragments.linkTeaser}
  ${fragments.termLcCategory}
  ${fragments.audienceTopics}
  ${fragments.emailContact}
  ${fragments.phoneNumber}
  ${fragments.audienceBeneficiaries}
  ${fragments.audienceNonBeneficiaries}
  ${fragments.termTopics}

  ${nodeStepByStep}

  query GetNodeStepByStep($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["step_by_step"] }
      ]
    }) {
      entities {
        ... nodeStepByStep
      }
    }
  }
`;

module.exports = {
  fragment: nodeStepByStep,
  GetNodeStepByStep,
};
