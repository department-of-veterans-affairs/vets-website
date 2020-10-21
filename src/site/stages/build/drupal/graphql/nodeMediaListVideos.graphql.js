const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeMediaListVideos on NodeMediaListVideos {
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

  fieldMediaListVideos {
    entity {
      ... on ParagraphMediaListVideos {
        fieldSectionHeader
        fieldVideos {
          targetId
          entity {
            ... on MediaVideo {
              name
              fieldMediaVideoEmbedField
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
