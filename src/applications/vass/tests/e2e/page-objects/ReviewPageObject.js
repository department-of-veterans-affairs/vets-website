import PageObject from './PageObject';

export class ReviewPageObject extends PageObject {
  /**
   * Assert the Review page is displayed
   * @returns {ReviewPageObject}
   */
  assertReviewPage() {
    this.assertHeading({
      name: 'Review your VA Solid Start appointment details',
      level: 1,
      exist: true,
    });

    // Assert no error states on initial load
    this.assertWrapperErrorAlert({ exist: false });

    this.assertElement('review-page', { exist: true });
    this.assertConfirmButton();

    this.assertDateTimeSection();
    this.assertTopicSection();
    this.assertConfirmButton();
    this.assertTopicDescriptionExists();

    // Assert need help footer
    this.assertNeedHelpFooter();

    return this;
  }

  /**
   * Assert the date and time section is displayed
   * @returns {ReviewPageObject}
   */
  assertDateTimeSection() {
    this.assertElement('date-time-title', {
      containsText: 'Date and time',
    });
    this.assertElement('date-time-edit-link', { exist: true });
    return this;
  }

  /**
   * Assert the date and time description contains the given text (e.g. date or time portion).
   * Use this to verify the displayed appointment date/time after changing the selection.
   * @param {string} text - Text that should appear in the date-time-description (e.g. "June 3, 2025" or "1:30")
   * @returns {ReviewPageObject}
   */
  assertDateTimeDescriptionContains(text) {
    this.assertElement('date-time-description', {
      containsText: text,
    });
    return this;
  }

  /**
   * Assert the topic section is displayed
   * @returns {ReviewPageObject}
   */
  assertTopicSection() {
    this.assertElement('topic-title', {
      containsText: 'Topic',
    });
    this.assertElement('topic-edit-link', { exist: true });
    return this;
  }

  /**
   * Assert the topic description contains specific text
   * @param {string} topicText - The expected topic text
   * @returns {ReviewPageObject}
   */
  assertTopicDescription(topicText) {
    this.assertElement('topic-description', {
      containsText: topicText,
    });
    return this;
  }

  /**
   * Assert the topic description exists
   * @returns {ReviewPageObject}
   */
  assertTopicDescriptionExists() {
    this.assertElement('topic-description', { exist: true });
    return this;
  }

  /**
   * Click the edit link for date and time
   * @returns {ReviewPageObject}
   */
  clickEditDateTime() {
    cy.findByTestId('date-time-edit-link')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Click the edit link for topic
   * @returns {ReviewPageObject}
   */
  clickEditTopic() {
    cy.findByTestId('topic-edit-link')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Click the confirm appointment button
   * @returns {ReviewPageObject}
   */
  clickConfirmAppointment() {
    cy.findByTestId('confirm-call-button')
      .should('exist')
      .click();
    return this;
  }

  /**
   * Assert the confirm button exists
   * @returns {ReviewPageObject}
   */
  assertConfirmButton() {
    cy.findByTestId('confirm-call-button').should(
      'have.attr',
      'text',
      'Confirm appointment',
    );
    return this;
  }

  /**
   * Confirm the appointment by clicking the confirm button
   * @returns {ReviewPageObject}
   */
  confirmAppointment() {
    this.clickConfirmAppointment();
    return this;
  }

  /**
   * Edit the date and time selection
   * @returns {ReviewPageObject}
   */
  editDateTime() {
    this.clickEditDateTime();
    return this;
  }

  /**
   * Edit the topic selection
   * @returns {ReviewPageObject}
   */
  editTopic() {
    this.clickEditTopic();
    return this;
  }
}

export default new ReviewPageObject();
