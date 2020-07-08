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
  status
}
`;

module.exports = fragment;
