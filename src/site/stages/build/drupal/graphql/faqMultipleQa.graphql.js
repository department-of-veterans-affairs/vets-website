const fragments = require('./fragments.graphql');

const entityElementsFromPages = require('./entityElementsForPages.graphql');

// faq_multiple_q_a, 6898
const faqMultipleQA = `
fragment faqMultipleQA on NodeFaqMultipleQA {
  ${entityElementsFromPages}
  entityBundle
  changed

  fieldTableOfContentsBoolean
  fieldIntroTextLimitedHtml {
    processed
  }
  fieldQAGroups {
    entity {
      ... on ParagraphQAGroup {
        fieldSectionHeader
        fieldAccordionDisplay
        fieldQAs {
          entity {
            ... on NodeQA {
              title
              entityId
              entityBundle
              fieldAnswer {
                entity {
                  entityType
                  entityBundle
                  ... richTextCharLimit1000
                  ... reactWidget
                }
              }
            }
          }
        }
      }
    }
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

const GetNodeMultipleQaPages = `
  ${fragments.richTextCharLimit1000}
  ${fragments.reactWidget}
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

  ${faqMultipleQA}

  query GetNodeMultipleQaPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["faq_multiple_q_a"] }
      ]
    }) {
      entities {
        ... faqMultipleQA
      }
    }
  }
`;

module.exports = {
  fragment: faqMultipleQA,
  GetNodeMultipleQaPages,
};
