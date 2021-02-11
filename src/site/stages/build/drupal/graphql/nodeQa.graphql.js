const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const nodeQa = `
fragment nodeQa on NodeQA {
  ${entityElementsFromPages}
  entityBundle

  changed
  fieldStandalonePage
  fieldAnswer {
    entity {
      entityType
      entityBundle
      ... richTextCharLimit1000
      ... reactWidget
    }
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

const GetNodeQa = `
  ${fragments.richTextCharLimit1000}
  ${fragments.reactWidget}
  ${fragments.alertParagraph}
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

  ${nodeQa}

  query GetNodeQa($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["q_a"] }
      ]
    }) {
      entities {
        ... nodeQa
      }
    }
  }
`;

module.exports = {
  fragment: nodeQa,
  GetNodeQa,
};
