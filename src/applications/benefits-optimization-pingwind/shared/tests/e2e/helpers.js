export const getPagePaths = formConfig => {
  // For testing v3-web-component pages.
  // Returns an flat object of page-paths, keyed by page-keys in formConfig.
  const { chapters } = formConfig;
  const pagePaths = {};

  Object.keys(chapters).forEach(chapter => {
    const { pages } = chapters[chapter];
    Object.keys(pages).forEach(page => {
      pagePaths[page] = pages[page].path;
    });
  });

  return pagePaths;
};

export const fillTextWebComponent = (fieldName, value) => {
  cy.fillVaTextInput(`root_${fieldName}`, value);
};

export const fillTextAreaWebComponent = (fieldName, value) => {
  cy.fillVaTextarea(`root_${fieldName}`, value);
};

export const selectRadioWebComponent = (fieldName, value) => {
  cy.selectVaRadioOption(`root_${fieldName}`, value);
};

export const selectYesNoWebComponent = (fieldName, value) => {
  cy.selectYesNoVaRadioOption(`root_${fieldName}`, value);
};

export const selectDropdownWebComponent = (fieldName, value) => {
  cy.selectVaSelect(`root_${fieldName}`, value);
};

export const selectCheckboxWebComponent = (fieldName, condition) => {
  cy.selectVaCheckbox(`root_${fieldName}`, condition);
};

export const selectGroupCheckboxWidget = label => {
  if (label) {
    cy.get(`va-checkbox[label="${label}"]`)
      .shadow()
      .get('#checkbox-element')
      .first()
      .click();
  }
};

export const selectCheckboxGroupWebComponent = data => {
  if (data && typeof data === 'object') {
    const truthyKeys = Object.keys(data).filter(key => data[key]);

    truthyKeys.forEach(truthyKey => {
      cy.get(`va-checkbox[data-key="${truthyKey}"]`)
        .shadow()
        .find('label')
        .click();
    });
  }
};

// patterns

export const fillFullNameWebComponentPattern = (fieldName, fullName) => {
  fillTextWebComponent(`${fieldName}_first`, fullName.first);
  fillTextWebComponent(`${fieldName}_middle`, fullName.middle);
  fillTextWebComponent(`${fieldName}_last`, fullName.last);
};

export const fillDateWebComponentPattern = (fieldName, value) => {
  if (typeof value === 'undefined' || value === null) {
    return;
  }

  const fieldKey = `root_${fieldName}`;

  cy.document().then(doc => {
    const hasVaDate = doc.querySelector(`va-date[name="${fieldKey}"]`);
    const hasVaMemorableDate = doc.querySelector(
      `va-memorable-date[name="${fieldKey}"]`,
    );

    if (hasVaDate) {
      return cy.fillVaDate(fieldKey, value);
    }

    if (hasVaMemorableDate) {
      return cy.fillVaMemorableDate(fieldKey, value);
    }

    throw new Error(`Date field ${fieldKey} not found on the page.`);
  });
};

export const selectRelationshipToVeteranPattern = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    selectRadioWebComponent(
      `${fieldName}_relationshipToVeteran`,
      value?.relationshipToVeteran,
    );
    if (value?.relationshipToVeteran === 'other') {
      cy.get(
        `va-text-input[name="root_${fieldName}_otherRelationshipToVeteran"]`,
      )
        .shadow()
        .find('input')
        .type(value?.otherRelationshipToVeteran);
    }
  }
};

// page test definitions

export const introductionPageFlow = () => {
  cy.get('va-button[text*="start"]');
  cy.findAllByText(/without signing in/i)
    .first()
    .click({ force: true });
};

export const fillStatementOfTruthSignature = veteranSignature => {
  cy.get('#veteran-signature')
    .shadow()
    .get('#inputField')
    .type(veteranSignature);
};

export const checkStatementOfTruthBox = () => {
  cy.get(`va-checkbox[id="veteran-certify"]`)
    .shadow()
    .find('input')
    .click({ force: true });
};

export const reviewAndSubmitPageFlow = (
  signerName,
  submitButtonText = 'Submit application',
) => {
  let veteranSignature = signerName;

  if (typeof veteranSignature === 'object') {
    veteranSignature = signerName.middle
      ? `${signerName.first} ${signerName.middle} ${signerName.last}`
      : `${signerName.first} ${signerName.last}`;
  }

  fillStatementOfTruthSignature(veteranSignature);
  checkStatementOfTruthBox();
  cy.findByText(submitButtonText, {
    selector: 'button',
  }).click();
};
