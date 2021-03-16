const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const fragments = require('./fragments.graphql');

const { generatePaginatedQueries } = require('../individual-queries-helpers');

const vaFormFragment = `
fragment vaFormPage on NodeVaForm {
  ${entityElementsFromPages}
  changed
  fieldVaFormName
  fieldVaFormTitle
  fieldVaFormType
  fieldVaFormUrl {
    uri
    title
    options
  }
  fieldVaFormUsage {
    value
    format
    processed
  }
  fieldVaFormNumber
  ${FIELD_ALERT}
  fieldVaFormAdministration {
    targetId
    entity {
      entityLabel
    }
  }
  fieldVaFormToolIntro
  fieldVaFormToolUrl {
    uri
    title
    options
  }
  fieldBenefitCategories {
    targetId
    entity {
      ... on NodeLandingPage {
        fieldHomePageHubLabel
      }
    }
  }
  fieldVaFormRevisionDate {
    value
    date
  }
  fieldVaFormIssueDate {
    value
    date
  }
  fieldVaFormNumPages
  fieldVaFormRelatedForms {
    targetId
    entity {
      ... on NodeVaForm {
        fieldVaFormNumber
        fieldVaFormName
        fieldVaFormUsage {
          value
          format
          processed
        }
        fieldVaFormUrl {
          uri
        }
      }
    }
  }
  fieldVaFormLinkTeasers {
    entity {
      entityLabel
      parentFieldName
      ... linkTeaser
    }
  }
  status
}
`;

function getNodeVaFormSlice(operationName, offset, limit) {
  return `
    ${fragments.alert}
    ${fragments.linkTeaser}
    ${vaFormFragment}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
        filter: {
          conditions: [
            { field: "status", value: ["1"], enabled: $onlyPublishedContent },
            { field: "type", value: ["va_form"] }
          ]
      }) {
        entities {
          ... vaFormPage
        }
      }
    }
`;
}

function getNodeVaFormQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodeVaForm',
    entitiesPerSlice: 25,
    totalEntities: entityCounts.data.vaForm.count,
    getSlice: getNodeVaFormSlice,
  });
}

module.exports = {
  fragment: vaFormFragment,
  getNodeVaFormQueries,
};
