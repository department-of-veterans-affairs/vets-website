const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const fragments = require('./fragments.graphql');

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

function getNodeVaFormSlice(operationName, offset, limit = 100) {
  return `
    ${fragments.alert}
    ${fragments.linkTeaser}
    ${vaFormFragment}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "changed", direction:  ASC }
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

module.exports = {
  fragment: vaFormFragment,
  VaFormQuerySlices: {
    GetNodeVaFormsSlice1: getNodeVaFormSlice('GetNodeVaFormsSlice2', 0),
    GetNodeVaFormsSlice2: getNodeVaFormSlice('GetNodeVaFormsSlice3', 100),
    GetNodeVaFormsSlice3: getNodeVaFormSlice('GetNodeVaFormsSlice3', 200),
    GetNodeVaFormsSlice4: getNodeVaFormSlice('GetNodeVaFormsSlice3', 300),
    GetNodeVaFormsSlice5: getNodeVaFormSlice('GetNodeVaFormsSlice3', 400, 9999),
  },
};
