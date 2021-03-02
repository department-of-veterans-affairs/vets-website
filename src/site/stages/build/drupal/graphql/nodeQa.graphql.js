const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const { generatePaginatedQueries } = require('../individual-queries-helpers');

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

function getNodeQaSlice(operationName, offset, limit) {
  return `
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

    ${nodeQa}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
        filter: {
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
}

function getNodeQaQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodeQa',
    entitiesPerSlice: 25,
    totalEntities: entityCounts.data.nodeQa.count,
    getSlice: getNodeQaSlice,
  });
}

module.exports = {
  fragment: nodeQa,
  getNodeQaQueries,
};
