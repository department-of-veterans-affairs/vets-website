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
  fieldRelatedBenefitHubs {
    entity {
      ... on NodeLandingPage {
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
