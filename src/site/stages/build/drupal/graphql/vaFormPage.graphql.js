const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment vaFormPage on NodeVaForm {
  ${entityElementsFromPages}
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
  fieldVaFormAdministration {
    targetId
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
      entityLabel
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
        fieldVaFormToolUrl {
          uri
          title
          options
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

module.exports = fragment;
