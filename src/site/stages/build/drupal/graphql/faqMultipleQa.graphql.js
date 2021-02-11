const entityElementsFromPages = require('./entityElementsForPages.graphql');

// faq_multiple_q_a, 6898
module.exports = `
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
