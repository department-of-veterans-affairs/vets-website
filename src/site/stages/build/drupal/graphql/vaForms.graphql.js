module.exports = `
fragment vaFormPage on NodeVaForm {
  title
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
  fieldAdministration {
    targetId
  }
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
  moderationState
}
`;
