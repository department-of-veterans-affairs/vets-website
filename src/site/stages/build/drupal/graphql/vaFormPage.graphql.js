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

module.exports = fragment;
