const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeMediaListImages on NodeMediaListImages {
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
  fieldTags {
    entity {
      ... on ParagraphAudienceTopics {
        fieldTopics {
          entity {
            ... on TaxonomyTermTopics {
              entityUrl {
                path
              }
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

  fieldMediaListImages {
    entity {
      ... on ParagraphMediaListImages {
        fieldSectionHeader
        fieldImages {
          entity {
            ... on MediaImage {
              entityLabel
              fieldDescription
              image {
                alt
                height
                url
                width
              }
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
