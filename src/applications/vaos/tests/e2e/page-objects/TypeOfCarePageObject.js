import PageObject from './PageObject';
import featureFlags from '../../../services/mocks/featureFlags';

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
    const featureImmediateCareAlert = featureFlags.filter(
      feature => feature.name === 'vaOnlineSchedulingImmediateCareAlert',
    );

    if (featureImmediateCareAlert) {
      cy.url().should('include', '/type-of-care');
      this.assertLink({ name: 'Back', useShadowDOM: true });
      return this;
    }

    return super.assertUrl(
      {
        url: '/type-of-care',
        breadcrumb: 'What type of care do you need?',
      },
      { timeout: 10000 },
    );
  }

  selectTypeOfCare(label) {
    this.selectRadioButton(label);
    return this;
  }
}

export default new TypeOfCarePageObject();
