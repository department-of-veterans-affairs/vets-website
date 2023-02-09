/* eslint-disable cypress/no-unnecessary-waiting */
describe('Visual regression tests', () => {
  it('Should match previous screenshot "about Page"', () => {
    cy.visit('/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287');
    cy.wait(1000);
    cy.matchImageSnapshot();
  });
});
