import mockFeedbackPost from './fixtures/mocks/feedback-post.json';
import mockFeedbackGet from './fixtures/mocks/feedback-1234.json';

describe('Feedback Tool Test', () => {
  it('Fills the form and navigates accordingly', () => {
    cy.intercept('POST', '/v0/gi_bill_feedbacks', { body: mockFeedbackPost });
    cy.intercept('GET', '/v0/gi_bill_feedbacks/1234', mockFeedbackGet);

    cy.visit('/');
  });
});
