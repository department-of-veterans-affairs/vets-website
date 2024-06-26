/* eslint-disable cypress/unsafe-to-chain-command */
export const selectYesNoWebComponent = (fieldName, value) => {
  cy.selectYesNoVaRadioOption(`root_${fieldName}`, value);
};

export const selectRadioWebComponent = (fieldName, value) => {
  cy.selectVaRadioOption(`root_${fieldName}`, value);
};

export const fillTextWebComponent = (fieldName, value) => {
  cy.fillVaTextInput(`root_${fieldName}`, value);
};

export const fillFullNameWebComponentPattern = (fieldName, fullName) => {
  fillTextWebComponent(`${fieldName}_first`, fullName.first);
  fillTextWebComponent(`${fieldName}_middle`, fullName.middle);
  fillTextWebComponent(`${fieldName}_last`, fullName.last);
};

export const selectCheckboxWebComponent = (fieldName, condition) => {
  cy.selectVaCheckbox(`root_${fieldName}`, condition);
};

export const selectDropdownWebComponent = (fieldName, value) => {
  cy.selectVaSelect(`root_${fieldName}`, value);
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
  // List loop fields sometimes fail on this because the state <select> renders as a text input
  // TODO: look into that bug. For now, set the test to check which field type we have
  cy.get('body').then(body => {
    if (body.find(`va-select[name="root_${fieldName}_state"]`).length > 0)
      selectDropdownWebComponent(`${fieldName}_state`, addressObject.state);
    if (body.find(`va-text-input[name="root_${fieldName}_state"]`).length > 0)
      fillTextWebComponent(`${fieldName}_state`, addressObject.state);
  });
  fillTextWebComponent(`${fieldName}_postalCode`, addressObject.postalCode);
};

export const fillDateWebComponentPattern = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    const [year, month, day] = value.split('-');

    if (navigator.userAgent.includes('Chrome')) {
      // LIFTED FROM simple-forms/shared/tests/e2e/helpers.js:
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
    .click({ force: true });
  cy.findByText(submitButtonText, {
    selector: 'button',
  }).click();
};

/**
 * Puts all page objects into an object where pagename maps to page data
 * E.g., {page1: {path: '/blah'}}*
 * @param {object} formConfig A standard config representing a form
 * @returns object mapping page name to the matching page object: {page1: {path: '/blah'}}
 */
export function getAllPages(formConfig) {
  const allPages = {};
  Object.values(formConfig.chapters).forEach(ch =>
    Object.keys(ch.pages).forEach(p => {
      allPages[p] = ch.pages[p];
    }),
  );
  return allPages;
}

export function missingValErrMsg(key, original, submitted) {
  const ogVal =
    typeof original[key] === 'object'
      ? JSON.stringify(original[key])
      : original[key];
  const subVal =
    typeof submitted[key] === 'object'
      ? JSON.stringify(submitted[key])
      : submitted[key];
  return `Property with name ${key} and value ${ogVal} not found in submitted data (instead got ${subVal})`;
}

/**
 * Verifies that every key in `data` has a matching key in `req` with an identical value.
 *
 * Expect all original data used to populate the form to be present
 * in the submission - this is how we know that pages we intended to
 * fill didn't get skipped on standard fill runthroughs:
 *
 * @param {object} data Object containing form data to be input in a form
 * @param {object} req Object containing form data from a form submission
 */
export function verifyAllDataWasSubmitted(data, req) {
  describe('Data submitted after E2E runthrough should include all data supplied in test file', () => {
    Object.keys(data).forEach(k => {
      // handle special cases:
      const lc = k.toLowerCase();
      if (lc.includes('dob') || lc.includes('date') || k === 'missingUploads') {
        // Just check length match. There's a discrepancy in the
        // format of dates (goes from YYYY-MM-DD to MM-DD-YYYY).
        // TODO: Address discrepancy at some point.
        expect(data[k]?.length, missingValErrMsg(k, data, req)).to.equal(
          req[k]?.length,
        );

        // if 'missingUploads' -> we just want to check that we have the same number
        // of files listed, so re-using this conditional works.
      } else {
        // eslint-disable-next-line no-unused-expressions
        expect(
          req[k],
          `Expected submitted data to include property ${k} and for it to not be undefined.`,
        ).to.not.be.undefined;
      }
      // cy.axeCheck();
    });
  });
}
