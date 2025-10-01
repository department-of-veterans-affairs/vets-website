import PageObject from './PageObject';

class TypeOfCarePageObject extends PageObject {
  assertAddressAlert({ exist = true } = {}) {
    if (exist) {
      cy.get('va-alert[status=warning]')
        .as('alert')
        .shadow();
      cy.get('@alert').contains(
        /To use some of the tool.s features, you need a home address on file/i,
      );
    } else {
      cy.get('va-alert[status=warning]').should('not.exist');
    }

    return this;
  }

  assertUrl() {
    cy.wait('@v0:get:feature_toggles').then((req, _resp) => {
      const toggles = req.response.body.data.features;
      const featureImmediateCareAlert = toggles.find(
        toggle =>
          (toggle.name === 'vaOnlineSchedulingImmediateCareAlert') === true,
      );

      if (
        featureImmediateCareAlert &&
        featureImmediateCareAlert.value === true
      ) {
        cy.url().should('include', '/type-of-care');
        this.assertLink({ name: 'Back', useShadowDOM: true });
      } else {
        super.assertUrl(
          {
            url: '/type-of-care',
            breadcrumb: 'What type of care do you need?',
          },
          { timeout: 10000 },
        );
      }
    });

    return this;
  }

  selectTypeOfCare(label) {
    this.selectRadioButton(label);
    return this;
  }
}

export default new TypeOfCarePageObject();
