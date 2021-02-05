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

const GetNodeVaForms = `

  ${fragments.alert}
  ${fragments.linkTeaser}
  ${vaFormFragment}

  query GetNodeVaForms($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
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

module.exports = {
  fragment: vaFormFragment,
  GetNodeVaForms,
};
