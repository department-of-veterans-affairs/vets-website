const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const nodeMediaListVideos = `
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

  fieldMediaListVideos {
    entity {
      ... on ParagraphMediaListVideos {
        fieldSectionHeader
        fieldVideos {
          targetId
          entity {
            ... on MediaVideo {
              fieldDescription
              fieldDuration
              fieldMediaInLibrary
              fieldMediaSubmissionGuideline
              fieldMediaVideoEmbedField
              fieldPublicationDate {
                value
                date
              }
              name
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

const GetNodeMediaListVideos = `
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

  ${nodeMediaListVideos}

  query GetNodeMediaListVideos($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["media_list_videos"] }
      ]
    }) {
      entities {
        ... nodeMediaListVideos
      }
    }
  }
`;

module.exports = {
  fragment: nodeMediaListVideos,
  GetNodeMediaListVideos,
};
