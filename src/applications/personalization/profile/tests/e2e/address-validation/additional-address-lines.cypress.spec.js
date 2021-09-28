import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  context('when entering info on line two', () => {
    it('show show the address validation screen', () => {
      setUp('valid-address');

      cy.findByLabelText(/^street address \(/i)
        .clear()
        .type('36320 Coronado Dr');
      cy.findByLabelText(/^street address line 2/i)
        .clear()
        .type('care of Care Taker');
      cy.findByLabelText(/^street address line 3/i).clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('Fremont');
      cy.findByLabelText(/^State/).select('MD');
      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('94536');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress').should(
        'contain',
        'Please confirm your address',
      );
    });
  });
});
