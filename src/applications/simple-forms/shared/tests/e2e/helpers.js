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

export const fillAddressWebComponentPattern = (fieldName, addressObject) => {
  selectCheckboxWebComponent(
    `${fieldName}_isMilitary`,
    addressObject.isMilitary,
  );
  if (addressObject.city) {
    if (addressObject.isMilitary) {
      // there is a select dropdown instead when military is checked
      selectDropdownWebComponent(`${fieldName}_city`, addressObject.city);
    } else {
      fillTextWebComponent(`${fieldName}_city`, addressObject.city);
    }
  }
  selectDropdownWebComponent(`${fieldName}_country`, addressObject.country);
  fillTextWebComponent(`${fieldName}_street`, addressObject.street);
  fillTextWebComponent(`${fieldName}_street2`, addressObject.street2);
  fillTextWebComponent(`${fieldName}_street3`, addressObject.street3);
  selectDropdownWebComponent(`${fieldName}_state`, addressObject.state);
  fillTextWebComponent(`${fieldName}_postalCode`, addressObject.postalCode);
};

export const fillDateWebComponentPattern = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    const [year, month, day] = value.split('-');

    if (navigator.userAgent.includes('Chrome')) {
      // There is a bug only on Chromium based browsers where
      // VaMemorableDate text input fields will think they are
      // disabled if you blur focus of the window while the test
      // is running. realPress and realType solve this issue,
      // but these are only available for Chromium based browsers.
      // See cypress-real-events npmjs for more info.
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .select(parseInt(month, 10))
        .realPress('Tab')
        .realType(day)
        .realPress('Tab')
        .realType(year);
    } else {
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .select(parseInt(month, 10))
        .then(() => {
          cy.get(`va-memorable-date[name="root_${fieldName}"]`)
            .shadow()
            .find('va-text-input.usa-form-group--day-input')
            .shadow()
            .find('input')
            .type(day)
            .then(() => {
              cy.get(`va-memorable-date[name="root_${fieldName}"]`)
                .shadow()
                .find('va-text-input.usa-form-group--year-input')
                .shadow()
                .find('input')
                .type(year);
            });
        });
    }
  }
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
  cy.findAllByText(/start/i, { selector: 'button' });
  cy.findAllByText(/without signing in/i)
    .first()
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

  cy.get('#veteran-signature')
    .shadow()
    .get('#inputField')
    .type(veteranSignature);
  cy.get(`va-checkbox[name="veteran-certify"]`)
    .shadow()
    .find('input')
    .check();
  cy.findByText(submitButtonText, {
    selector: 'button',
  }).click();
};
