const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeChecklist on NodeChecklist {
  ${entityElementsFromPages}
  entityBundle

  changed
  title
  fieldIntroTextLimitedHtml {
    processed
  }

  fieldButtonsRepeat
  fieldButtons {
    entity {
      ... button
    }
  }
  fieldAlertSingle {
    entity {
      ... alertSingle
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
  fieldTags {
    entity {
      ... on ParagraphAudienceTopics {
        fieldTopics {
          entity {
            ... on TaxonomyTermTopics {
              name
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
  fieldChecklist {
    entity {
      ... on ParagraphChecklist {
        fieldChecklistSections {
          entity {
            ... on ParagraphChecklistItem {
              fieldSectionIntro
              fieldSectionHeader
              fieldChecklistItems
            }
          }
        }
      }
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

module.exports = fragment;
