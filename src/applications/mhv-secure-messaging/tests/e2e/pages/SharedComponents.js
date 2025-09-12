import { Locators } from '../utils/constants';

class ContactListPage {
  backBreadcrumb = () => {
    return cy.findByTestId(Locators.BACK_BREADCRUMB_DATA_TEST_ID);
  };

  clickBackBreadcrumb = () => {
    this.backBreadcrumb().scrollIntoView({
      waitForAnimation: true,
    });
    this.backBreadcrumb().click({ force: true });
  };
}

export default new ContactListPage();
