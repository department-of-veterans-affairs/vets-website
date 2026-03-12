import { appName, rootUrl } from '../../manifest.json';
import { initializeApi, userMock } from './setup';

let heading;

describe(`${appName} -- editing test`, () => {
  beforeEach(() => {
    initializeApi();
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
  });

  it('is successful', () => {
    // introduction
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 1,
      name: /Medical supplies$/,
    };
    cy.findByRole('heading', heading).should('have.focus');
    cy.findByText(/Start a new order$/).click({ waitForAnimations: true });

    // choose supplies
    cy.injectAxeThenAxeCheck();
    cy.selectVaCheckbox('root_chosenSupplies_6584', true);
    cy.findByText(/Continue$/).click();

    // contact information
    cy.injectAxeThenAxeCheck();
    // assertions
    cy.findByText(/vets\.gov\.user\+1@gmail\.com$/).should('exist');
    cy.findByText(/101 EXAMPLE STREET/).should('exist');
    cy.findByText(/APT 2/).should('exist');
    cy.findByText(/KANSAS CITY, MO 64117/).should('exist');
    cy.findByRole('link', {
      name: 'Edit email address',
    }).click();

    // edit email address
    cy.injectAxeThenAxeCheck();
    cy.fillVaTextInput('root_emailAddress', 'vets.gov.newuser+5@gmail.com');
    cy.get('va-button[text="update"]').click();

    // assert for email change
    cy.findByText(/vets\.gov\.newuser\+5@gmail\.com$/).should('exist');
    cy.findByText(/vets\.gov\.user\+1@gmail\.com$/).should('not.exist');

    cy.findByRole('link', {
      name: 'Edit mailing address',
    }).click();

    // edit mailing address
    cy.injectAxeThenAxeCheck();
    cy.fillVaTextInput('root_permanentAddress_street', '123 NEW STREET');
    cy.fillVaTextInput('root_permanentAddress_city', 'TAMPA');
    cy.fillVaTextInput('root_permanentAddress_postalCode', '33611');
    cy.selectVaSelect('root_permanentAddress_state', 'FL');

    cy.get('va-button[text="update"]').click();

    // assert for mailing address changes
    cy.findByText(/123 NEW STREET/).should('exist');
    cy.findByText(/APT 2/).should('exist');
    cy.findByText(/TAMPA, FL 33611/).should('exist');

    // contact information
    cy.injectAxeThenAxeCheck();
    cy.findByText(/Continue$/).click();

    // review supplies reordering
    cy.injectAxeThenAxeCheck();
    cy.get('va-accordion-item[data-chapter="chooseSuppliesChapter"]').click();
    cy.findByText(/ERHK HE11 680 MINI/).should('exist');
    cy.findByText(/AIRFIT P10/).should('not.exist');

    // review: edit supplies reordering
    cy.get('va-button[label="Edit Available for reorder"]').click();
    cy.selectVaCheckbox('root_chosenSupplies_6650', true);
    cy.findByText(/Update page$/, { selector: 'button' }).click();

    // review: assert supplies reordering
    cy.findByText(/ERHK HE11 680 MINI/).should('exist');
    cy.findByText(/AIRFIT P10/).should('exist');

    // review contact information
    cy.get(
      'va-accordion-item[data-chapter="contactInformationChapter"]',
    ).click();
    // review: assert for email and mailing address
    cy.findByText(/vets\.gov\.newuser\+5@gmail\.com$/).should('exist');
    cy.findByText(/123 NEW STREET/).should('exist');
    cy.findByText(/APT 2/).should('exist');
    cy.findByText(/TAMPA, FL 33611/).should('exist');

    // review: edit email
    cy.get('va-button[label="Edit Email address"]').click();
    cy.fillVaTextInput('root_emailAddress', 'vets.gov.xxxxx+5@gmail.com');

    // review: cancel out of edit email
    cy.get('va-button[text="Cancel"]').click();

    // review: assert that email remains unchanged
    cy.findByText(/vets\.gov\.newuser\+5@gmail\.com$/).should('exist');

    // review: edit mailing address
    cy.get('va-button[label="Edit Shipping address"]').click();
    cy.fillVaTextInput('root_permanentAddress_street', '');
    cy.fillVaTextInput('root_permanentAddress_street', '111 REVIEWER STREET');
    cy.get('va-button[text="Update page"]').click();

    // review: assert for mailing address changes
    cy.findByText(/111 REVIEWER STREET/).should('exist');
    cy.findByText(/APT 2/).should('exist');
    cy.findByText(/TAMPA, FL 33611/).should('exist');

    // submit review
    cy.findByRole('button', { name: /Submit$/ }).click();

    // confirmation
    cy.injectAxeThenAxeCheck();
    cy.get('va-alert[status="success"] h2').should(
      'contain.text',
      'You’ve submitted your medical supplies order',
    );
    // .should('have.focus'); // FIXME: element should receive focus.
  });
});
