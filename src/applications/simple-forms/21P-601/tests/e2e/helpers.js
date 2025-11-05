// This is based off of the existing simple forms `fillDateWebComponentPattern`
// helper. It can be used to fill in the `currentOrPastDateDigitsUI` component.
export const fillDateDigitsWebComponentPattern = (fieldName, value) => {
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
        .find('va-text-input.usa-form-group--month-input')
        .shadow()
        .find('input')
        .realType('')
        .realPress('Tab')
        .realType(month)
        .realPress('Tab')
        .realType(day)
        .realPress('Tab')
        .realType(year);
    } else {
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-input')
        .shadow()
        .find('input')
        .type(month)
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
